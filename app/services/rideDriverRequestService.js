import knex from "../../db/knex.js";
import * as driverMatchingService from "./driverMatchingService.js";
import * as rideDriverRequestRepo from "../repositories/rideDriverRequestRepository.js";
import * as rideRepo from "../repositories/rideRepository.js";
import * as driverRepo from "../repositories/driverRepository.js";
import { transformDriverRequests } from "../transformers/rideDriverRequestTransformer.js";
import { AppError } from "../utils/AppError.js";
import { sendNotification } from "../services/notificationService.js";
import { rideRequestTemplate } from "../notifications/templates/driverNotification.js";

/*
|--------------------------------------------------------------------------
| Get Pending Requests
|--------------------------------------------------------------------------
*/

export const getPendingRequests = async (userId) => {

    const requests = await rideDriverRequestRepo.findPendingByUserId(userId);

    return {
        success: true,
        message: "Ride requests fetched successfully.",
        data: transformDriverRequests(requests),
    };
};


/*
|--------------------------------------------------------------------------
| Accept / Reject Ride Request
|--------------------------------------------------------------------------
*/

export const respondToRequest = async (
    userId,
    requestId,
    status
) => {

    let nextDriverNotification = null;

    const result = await knex.transaction(async (trx) => {

        /*
        |--------------------------------------------------------------------------
        | Find Driver
        |--------------------------------------------------------------------------
        */

        const driver = await trx("drivers").where("user_id", userId).first();

        if (!driver) {
            throw new AppError("Driver not found.", 404 );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Pending Request
        |--------------------------------------------------------------------------
        */

        const request = await rideDriverRequestRepo.findPendingByDriverAndRequest(
            requestId,
            driver.id,
            trx
        );

        if (!request)
            throw new AppError("Ride request not found or already processed.", 404);


        /*
        |--------------------------------------------------------------------------
        | Check Request Expiry
        |--------------------------------------------------------------------------
        */

        if (request.expires_at && new Date(request.expires_at).getTime() <= Date.now()) {

            await rideDriverRequestRepo.updateStatus(
                request.id,
                "expired",
                {responded_at: new Date(),},
                trx
            );

            throw new AppError("Ride request has expired.", 410 );

        }


        /*
        |--------------------------------------------------------------------------
        | REJECT
        |--------------------------------------------------------------------------
        */
        if (status === "rejected") {

            const updatedRequest = await rideDriverRequestRepo.updateStatus(
                    request.id,
                    "rejected",
                    {
                        responded_at: new Date(),
                    },
                    trx
                );

                const ride = await trx("rides").where("id", request.ride_id).forUpdate().first();

                if (!ride) {
                    throw new AppError("Ride not found.", 404);
                }

                if (ride.status !== "requested") {
                    throw new AppError("Ride has already been assigned.", 409);
                }

            /*
            |----------------------------------------------------------------------
            | Find Next Driver
            |----------------------------------------------------------------------
            */
            const nextDriver = await driverMatchingService.requestNearestDriver(
                ride,
                trx
            );

            if (nextDriver) {

                nextDriverNotification = {
                    userId: nextDriver.driver.user_id,
                    token: nextDriver.driver.fcm_id,
                    rideId: ride.id,
                    requestId: nextDriver.request.id,
                };
            }

            /*
            |----------------------------------------------------------------------
            | No More Drivers
            |----------------------------------------------------------------------
            */

            if (!nextDriver) {

                await rideRepo.updateById(request.ride_id,
                    {status: "no_driver_found"},
                    trx
                );
                
                return {
                    success: true,
                    message: "Ride request rejected. No other driver found.",
                    data: {
                        request_id: Number(updatedRequest.id),
                        ride_id: Number(updatedRequest.ride_id),
                        status: updatedRequest.status,
                        next_driver: null,
                    },
                };
            }


            /*
            |----------------------------------------------------------------------
            | Next Driver Request Created
            |----------------------------------------------------------------------
            */

            return {
                success: true,
                message: "Ride request rejected. Request sent to next driver.",
                data: {
                    request_id: Number(updatedRequest.id),
                    ride_id: Number(updatedRequest.ride_id),
                    status: updatedRequest.status,

                    next_request: {
                        request_id: Number(nextDriver.request.id),
                        driver_id: Number(nextDriver.driver.driver_id),
                        vehicle_id: Number(nextDriver.driver.vehicle_id),
                        distance_km: Number(Number(nextDriver.driver.distance_km).toFixed(2)),
                        expires_at: nextDriver.request.expires_at,
                        status: nextDriver.request.status,
                    },
                },
            };
        }


        /*
        |--------------------------------------------------------------------------
        | ACCEPT
        |--------------------------------------------------------------------------
        |--------------------------------------------------------------------------
        | Lock Ride
        |--------------------------------------------------------------------------
        |
        | This is important for concurrent driver acceptance.
        |
        */

        const ride = await trx("rides")
            .where("id", request.ride_id)
            .forUpdate()
            .first();

        if (!ride)
            throw new AppError("Ride not found.", 404);

        /*
        |--------------------------------------------------------------------------
        | Ride Already Assigned
        |--------------------------------------------------------------------------
        */
        if (ride.status !== "requested")
            throw new AppError("Ride has already been assigned to another driver.", 409);

        /*
        |--------------------------------------------------------------------------
        | Driver Must Still Be Available
        |--------------------------------------------------------------------------
        */
        if (!driver.is_online || !driver.is_available)
            throw new AppError("Driver is no longer available.", 409);

        /*
        |--------------------------------------------------------------------------
        | Find Driver Vehicle
        |--------------------------------------------------------------------------
        */
        const vehicle = await driverRepo.findActiveVehicleForRide(
            driver.id,
            ride.vehicle_type_id,
            trx
        );

        if (!vehicle)
            throw new AppError("Driver does not have an active vehicle for this ride.", 409);


        /*
        |--------------------------------------------------------------------------
        | Assign Driver To Ride
        |--------------------------------------------------------------------------
        */
        const assignedRide = await rideRepo.assignDriver(
            ride.id,
            driver.id,
            vehicle.id,
            trx
        );

        if (!assignedRide)
            throw new AppError("Ride was already assigned to another driver.", 409);


        /*
        |--------------------------------------------------------------------------
        | Mark Driver Busy
        |--------------------------------------------------------------------------
        */
        await driverRepo.updateAvailability(
            driver.id,
            false,
            trx
        );


        /*
        |--------------------------------------------------------------------------
        | Accept Current Request
        |--------------------------------------------------------------------------
        */
        const updatedRequest = await rideDriverRequestRepo.updateStatus(
            request.id,
            "accepted",
            {
                responded_at: new Date(),
            },
            trx
        );


        /*
        |--------------------------------------------------------------------------
        | Expire Other Pending Requests
        |--------------------------------------------------------------------------
        */
        await trx("ride_driver_requests")
            .where("ride_id", ride.id)
            .where("status", "pending")
            .whereNot("id", request.id)
            .update({
                status: "expired",
                updated_at: knex.fn.now(),
            });


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
        return {
            success: true,
            message: "Ride accepted successfully.",
            data: {
                request_id: Number(updatedRequest.id),
                ride_id: Number(assignedRide.id),
                driver_id: Number(driver.id),
                vehicle_id: Number(vehicle.id),
                status: assignedRide.status,
            },
        };

    });

    /*
    |--------------------------------------------------------------------------
    | SEND NEXT DRIVER NOTIFICATION
    |--------------------------------------------------------------------------
    */
    if (nextDriverNotification && nextDriverNotification.token) {

        const notificationTemplate = await rideRequestTemplate({
            rideId: nextDriverNotification.rideId,
            requestId: nextDriverNotification.requestId,
        });

        await sendNotification({
            userId: nextDriverNotification.userId,
            token: nextDriverNotification.token,
            ...notificationTemplate,
        });
    }

    return result;
};

export const respondToRequestOldBackup = async (
    userId,
    requestId,
    status
) => {

    return await knex.transaction(async (trx) => {

        /*
        |--------------------------------------------------------------------------
        | Find Driver
        |--------------------------------------------------------------------------
        */

        const driver = await trx("drivers").where("user_id", userId).first();

        if (!driver) {
            throw new AppError("Driver not found.", 404 );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Pending Request
        |--------------------------------------------------------------------------
        */

        const request = await rideDriverRequestRepo.findPendingByDriverAndRequest(
            requestId,
            driver.id,
            trx
        );

        if (!request) {

            throw new AppError("Ride request not found or already processed.", 404);

        }


        /*
        |--------------------------------------------------------------------------
        | Check Request Expiry
        |--------------------------------------------------------------------------
        */

        if (request.expires_at && new Date(request.expires_at).getTime() <= Date.now()) {

            await rideDriverRequestRepo.updateStatus(
                request.id,
                "expired",
                {responded_at: new Date(),},
                trx
            );

            throw new AppError("Ride request has expired.", 410 );

        }


        /*
        |--------------------------------------------------------------------------
        | REJECT
        |--------------------------------------------------------------------------
        */

        if (status === "rejected") {

            const updatedRequest = await rideDriverRequestRepo.updateStatus(
                    request.id,
                    "rejected",
                    {
                        responded_at: new Date(),
                    },
                    trx
                );

                const ride = await trx("rides").where("id", request.ride_id).forUpdate().first();

                if (!ride) {
                    throw new AppError("Ride not found.", 404);
                }

                if (ride.status !== "requested") {
                    throw new AppError("Ride has already been assigned.", 409);
                }

            /*
            |----------------------------------------------------------------------
            | Find Next Driver
            |----------------------------------------------------------------------
            */

            const nextDriver = await driverMatchingService.requestNearestDriver(
                ride,
                trx
            );


            /*
            |----------------------------------------------------------------------
            | No More Drivers
            |----------------------------------------------------------------------
            */

            if (!nextDriver) {

                await rideRepo.updateById(request.ride_id, {
                    status: "no_driver_found",
                });
                
                return {
                    success: true,
                    message: "Ride request rejected. No other driver found.",
                    data: {
                        request_id: Number(updatedRequest.id),
                        ride_id: Number(updatedRequest.ride_id),
                        status: updatedRequest.status,
                        next_driver: null,
                    },
                };
            }


            /*
            |----------------------------------------------------------------------
            | Next Driver Request Created
            |----------------------------------------------------------------------
            */

            return {
                success: true,
                message: "Ride request rejected. Request sent to next driver.",
                data: {
                    request_id: Number(updatedRequest.id),
                    ride_id: Number(updatedRequest.ride_id),
                    status: updatedRequest.status,

                    next_request: {
                        request_id: Number(nextDriver.request.id),
                        driver_id: Number(nextDriver.driver.driver_id),
                        vehicle_id: Number(nextDriver.driver.vehicle_id),
                        distance_km: Number(Number(nextDriver.driver.distance_km).toFixed(2)),
                        expires_at: nextDriver.request.expires_at,
                        status: nextDriver.request.status,
                    },
                },
            };
        }


        /*
        |--------------------------------------------------------------------------
        | ACCEPT
        |--------------------------------------------------------------------------
        */


        /*
        |--------------------------------------------------------------------------
        | Lock Ride
        |--------------------------------------------------------------------------
        |
        | This is important for concurrent driver acceptance.
        |
        */

        const ride = await trx("rides")
            .where("id", request.ride_id)
            .forUpdate()
            .first();

        if (!ride) {

            throw new AppError("Ride not found.", 404);

        }


        /*
        |--------------------------------------------------------------------------
        | Ride Already Assigned
        |--------------------------------------------------------------------------
        */
        if (ride.status !== "requested") {
            throw new AppError("Ride has already been assigned to another driver.", 409);
        }


        /*
        |--------------------------------------------------------------------------
        | Driver Must Still Be Available
        |--------------------------------------------------------------------------
        */
        if (!driver.is_online || !driver.is_available) {
            throw new AppError("Driver is no longer available.", 409);
        }


        /*
        |--------------------------------------------------------------------------
        | Find Driver Vehicle
        |--------------------------------------------------------------------------
        */

        const vehicle = await driverRepo.findActiveVehicleForRide(
            driver.id,
            ride.vehicle_type_id,
            trx
        );

        if (!vehicle) {
            throw new AppError("Driver does not have an active vehicle for this ride.", 409);
        }


        /*
        |--------------------------------------------------------------------------
        | Assign Driver To Ride
        |--------------------------------------------------------------------------
        */
        const assignedRide = await rideRepo.assignDriver(
            ride.id,
            driver.id,
            vehicle.id,
            trx
        );

        if (!assignedRide) {
            throw new AppError("Ride was already assigned to another driver.", 409);
        }


        /*
        |--------------------------------------------------------------------------
        | Mark Driver Busy
        |--------------------------------------------------------------------------
        */
        await driverRepo.updateAvailability(
            driver.id,
            false,
            trx
        );


        /*
        |--------------------------------------------------------------------------
        | Accept Current Request
        |--------------------------------------------------------------------------
        */
        const updatedRequest = await rideDriverRequestRepo.updateStatus(
            request.id,
            "accepted",
            {
                responded_at: new Date(),
            },
            trx
        );


        /*
        |--------------------------------------------------------------------------
        | Expire Other Pending Requests
        |--------------------------------------------------------------------------
        */
        await trx("ride_driver_requests")
            .where("ride_id", ride.id)
            .where("status", "pending")
            .whereNot("id", request.id)
            .update({
                status: "expired",
                updated_at: knex.fn.now(),
            });


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */
        return {
            success: true,
            message: "Ride accepted successfully.",
            data: {
                request_id: Number(updatedRequest.id),
                ride_id: Number(assignedRide.id),
                driver_id: Number(driver.id),
                vehicle_id: Number(vehicle.id),
                status: assignedRide.status,
            },
        };

    });

};