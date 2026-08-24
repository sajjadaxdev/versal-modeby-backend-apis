import * as driverRepo from "../repositories/driverRepository.js";
import * as rideDriverRequestRepo from "../repositories/rideDriverRequestRepository.js";
import { sendNotification } from "../services/notificationService.js";
import { rideRequestTemplate } from "../notifications/templates/driverNotification.js";
import {RIDE_REQUEST_EXPIRATION_SECONDS} from "../../config/app.js";

export const findEligibleDrivers = async (ride) => {

    const drivers = await driverRepo.findEligibleDrivers({
        vehicleTypeId: ride.vehicle_type_id,
        pickupLat: ride.pickup_lat,
        pickupLng: ride.pickup_lng,
    });

    return drivers;
};


/*
|--------------------------------------------------------------------------
| Send Ride Request To Nearest Driver
|--------------------------------------------------------------------------
*/

export const requestNearestDriver = async (
    ride,
    trx = null
) => {

    const attemptedDriverIds = await rideDriverRequestRepo.findAttemptedDriverIds(
        ride.id,
        trx
    );

    const drivers = await driverRepo.findEligibleDrivers({
        vehicleTypeId: ride.vehicle_type_id,
        pickupLat: ride.pickup_lat,
        pickupLng: ride.pickup_lng,
        excludeDriverIds: attemptedDriverIds,
    });

    if (!drivers.length) {
        return null;
    }

    const driver = drivers[0];

    const requestedAt = new Date();

    const expiresAt = new Date(requestedAt.getTime() + RIDE_REQUEST_EXPIRATION_SECONDS * 1000);

    const request = await rideDriverRequestRepo.create({
        ride_id: ride.id,
        driver_id: driver.driver_id,
        status: "pending",
        requested_at: requestedAt,
        expires_at: expiresAt,
    }, trx || undefined);

    // const notificationTemplate = await rideRequestTemplate({
    //     rideId: ride.id,
    //     requestId: request.id,
    // });

    // if(driver.fcm_id)
    //     await sendNotification({
    //         userId: driver.user_id,
    //         token: driver.fcm_id,
    //         ...notificationTemplate,
    //     });

    return {
        request,
        driver,
    };
};


/*
|--------------------------------------------------------------------------
| Process Ride Driver Matching
|--------------------------------------------------------------------------
|
| This function:
|
| 1. Checks if ride already accepted
| 2. Checks active pending request
| 3. Expires expired request
| 4. Finds next nearest driver
| 5. Creates new request
| 6. Marks ride no_driver_found if nobody remains
|
|--------------------------------------------------------------------------
*/

export const processRideMatching = async (ride) => {

    /*
    |--------------------------------------------------------------------------
    | Ride Already Accepted
    |--------------------------------------------------------------------------
    */

    if (ride.status === "accepted") {

        return {
            status: "accepted",
            request: null,
            driver: null,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Check Existing Active Request
    |--------------------------------------------------------------------------
    */
    const activeRequest = await rideDriverRequestRepo.findActivePendingByRideId(
        ride.id
    );

    if (activeRequest) {

        return {
            status: "waiting",
            request: activeRequest,
            driver: null,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Expire Existing Request
    |--------------------------------------------------------------------------
    */
    const expiredRequest = await rideDriverRequestRepo.findExpiredPendingByRideId(
        ride.id
    );

    if (expiredRequest) {
        await rideDriverRequestRepo.expireRequest(expiredRequest.id);
    }


    /*
    |--------------------------------------------------------------------------
    | Find Next Driver
    |--------------------------------------------------------------------------
    */
    const result = await requestNearestDriver(ride);

    /*
    |--------------------------------------------------------------------------
    | No Driver Left
    |--------------------------------------------------------------------------
    */
    if (!result) {

        return {
            status: "no_driver_found",
            request: null,
            driver: null,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | New Driver Request
    |--------------------------------------------------------------------------
    */

    return {
        status: "request_sent",
        request: result.request,
        driver: result.driver,
    };
};