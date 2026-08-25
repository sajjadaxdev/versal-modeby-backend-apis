import knex from "../../db/knex.js";
import { AppError } from "../utils/AppError.js";

import * as rideRepo from "../repositories/rideRepository.js";
import * as cityService from "./cityService.js";
import * as currencyService from "./currencyConfigService.js";
import * as vehicleTypeRepo from "../repositories/vehicleTypeRepository.js";
import * as defaultFareConfigRepo from "../repositories/defaultFareConfigRepository.js";
import * as defaultSurgePricingRepo from "../repositories/defaultSurgePricingRepository.js";
import { formatCurrency } from "../helpers/commonHelper.js";
import { rideRequestTransformer } from "../transformers/rideTransformer.js";
import * as driverMatchingService from "./driverMatchingService.js";
import { sendNotification } from "../services/notificationService.js";
import { rideRequestTemplate } from "../notifications/templates/driverNotification.js";
import { getBaseUrl } from "../helpers/fileHelper.js";
import { calculateDistanceKm, calculateEtaMinutes } from "../helpers/geoHelper.js";
import { rideEnRoutePickupTemplate, driverArrivedPickupTemplate, rideStartedTemplate, } from "../notifications/templates/rideNotification.js";

export const getRideOptions = async (data) => {

    // const pickupCity = await cityService.getCityByLatLang(
    //     data.pickup_lat,
    //     data.pickup_lng
    // );

    // const dropCity = await cityService.getCityByLatLang(
    //     data.drop_lat,
    //     data.drop_lng
    // );

    const currency = (await currencyService.getActiveCurrency()).data ?? {};

    const vehicleTypes = (await vehicleTypeRepo.findAll({
        is_active: 1,
        limit: 1000,
    })).rows;

    const defaultFareConfigs = (await defaultFareConfigRepo.findAll({
        is_active: 1,
        limit: 1000,
    })).rows;

    const defaultSurgePricings = (await defaultSurgePricingRepo.findAll({
        is_active: 1,
        limit: 1000,
    })).rows;

    const rideOptions = [];
    const currentTime = new Date().toTimeString().slice(0, 8);

    for (const vehicleType of vehicleTypes) {


        // Fare Config
        const fareConfig = defaultFareConfigs.find(item =>
            Number(item.vehicle_type_id) === Number(vehicleType.id)
        );

        if (!fareConfig)
            continue;

        // Active Surge
        const surge = defaultSurgePricings.find(item => {
            if (Number(item.vehicle_type_id) !== Number(vehicleType.id)) {
                return false;
            }
            return (item.start_time <= currentTime && item.end_time >= currentTime);
        });

        const multiplier = surge ? Number(surge.multiplier) : 1;

        const baseFare = Number(fareConfig.base_fare) || 0;
        const perKmRate = Number(fareConfig.per_km_rate) || 0;
        const perMinRate = Number(fareConfig.per_min_rate) || 0;
        const minimumFare = Number(fareConfig.minimum_fare) || 0;

        // Fare Calculation
        const distanceFare = Number(data.distance_km) * perKmRate;
        const timeFare = Number(data.distance_mint) * perMinRate;

        let totalFare = (baseFare + distanceFare + timeFare) * multiplier;

        if (totalFare < Number(fareConfig.minimum_fare)) {
            totalFare = Number(fareConfig.minimum_fare);
        }

        rideOptions.push({
            vehicleType,
            currency,
            fare: {
                base_fare: baseFare,
                distance_fare: distanceFare,
                time_fare: timeFare,
                surge_multiplier: multiplier,
                total_fare: Number(totalFare.toFixed(2)),
                formatted_total_fare: formatCurrency(totalFare, currency)
            }

        });

    }

    return {
        success: true,
        message: "Ride options fetched seccessfully.",
        data: rideOptions,
    };
};

export const requestRide = async (userId, data) => {

    const ride = await rideRepo.create({
        rider_id: userId,
        driver_id: null,
        vehicle_type_id: data.vehicle_type_id,
        pickup_address: data.pickup_address,
        pickup_lat: data.pickup_lat,
        pickup_lng: data.pickup_lng,
        drop_address: data.drop_address,
        drop_lat: data.drop_lat,
        drop_lng: data.drop_lng,
        distance_km: data.distance_km,
        duration_minutes: data.duration_minutes,
        fare_estimate: data.fare_estimate,
        status: "requested"
    });

    return {
        success: true,
        message: "Ride requested successfully.",
        data: rideRequestTransformer(ride)
    };
};

export const findNearestDriver = async (rideId) => {

    const ride = await rideRepo.findById(rideId);

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    if (!["requested"].includes(ride.status)) {
        throw new AppError(
            "Driver matching is not available for this ride.",
            400
        );
    }


    const result = await driverMatchingService.processRideMatching(ride);

    /*
    |--------------------------------------------------------------------------
    | Driver Accepted
    |--------------------------------------------------------------------------
    */
    if (result.status === "accepted") {

        return {
            success: true,
            message: "Ride already accepted.",
            data: {
                ride_id: Number(ride.id),
                status: "accepted",
            },
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Existing Driver Request Still Active
    |--------------------------------------------------------------------------
    */
    if (result.status === "waiting") {

        return {
            success: true,
            message: "Waiting for driver response.",
            data: {
                ride_id: Number(ride.id),
                request_id: Number(result.request.id),
                status: "pending",
                expires_at: result.request.expires_at,
            },
        };
    }


    /*
    |--------------------------------------------------------------------------
    | No Driver Found
    |--------------------------------------------------------------------------
    */

    if (result.status === "no_driver_found") {

        await rideRepo.updateById(ride.id, {status: "no_driver_found"});

        return {
            success: false,
            message: "No driver found for this ride.",
            data: {
                ride_id: Number(ride.id),
                status: "no_driver_found",
            },
        };
    }


    /*
    |--------------------------------------------------------------------------
    | New Driver Request
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Send Notification
    |--------------------------------------------------------------------------
    */

    if (result.driver?.fcm_id) {

        const notificationTemplate =
            await rideRequestTemplate({
                rideId: ride.id,
                requestId: result.request.id,
            });

        await sendNotification({
            userId: result.driver.user_id,
            token: result.driver.fcm_id,
            ...notificationTemplate,
        });
    }


    return {
        success: true,
        message: "Ride request sent to nearest driver.",
        data: {
            ride_id: Number(ride.id),
            request_id: Number(result.request.id),
            driver_id: Number(result.driver.driver_id),
            vehicle_id: Number(result.driver.vehicle_id),
            distance_km: Number(Number(result.driver.distance_km).toFixed(2)),
            expires_at: result.request.expires_at,
            status: result.request.status,
        },
    };

};

export const findNearestDriverOld = async (rideId) => {

    const ride = await rideRepo.findById(rideId);

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    if (ride.status !== "requested") {
        throw new AppError(
            "Only requested rides can find a driver.",
            400
        );
    }

    const result = await driverMatchingService.requestNearestDriver(ride);

    if (!result) {

        await rideRepo.updateById(ride.id, {
            status: "no_driver_found",
        });

        return {
            success: false,
            message: "No eligible driver found.",
            data: null,
        };
    }

    return {
        success: true,
        message: "Ride request sent to nearest driver.",
        data: {
            ride_id: Number(ride.id),
            request_id: Number(result.request.id),
            driver_id: Number(result.driver.driver_id),
            vehicle_id: Number(result.driver.vehicle_id),
            distance_km: Number(Number(result.driver.distance_km).toFixed(2)),
            expires_at: result.request.expires_at,
            status: result.request.status,
        },
    };
};

export const getRideStatus = async (rideId) => {

    let ride = await rideRepo.getRideStatus(rideId);

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Driver Matching
    |--------------------------------------------------------------------------
    */

    if (ride.ride_status === "requested") {

        const matchingResult = await driverMatchingService.processRideMatching({
            id: ride.ride_id,
            vehicle_type_id: ride.vehicle_type_id,
            pickup_lat: ride.pickup_lat,
            pickup_lng: ride.pickup_lng,
        });


        /*
        |--------------------------------------------------------------------------
        | No Driver Found
        |--------------------------------------------------------------------------
        */

        if (matchingResult.status === "no_driver_found") {

            await rideRepo.updateById(
                ride.ride_id,
                {
                    status: "no_driver_found",
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get Fresh Ride Status
        |--------------------------------------------------------------------------
        */

        ride = await rideRepo.getRideStatus(rideId);
    }


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    const data = {
        ride_id: Number(ride.ride_id),
        status: ride.ride_status,
        driver: null,
    };


    if (ride.driver_id) {

        data.driver = {
            driver_id: Number(ride.driver_id),
            user_id: Number(ride.driver_user_id),
            first_name: ride.driver_first_name,
            last_name: ride.driver_last_name,
            rating: ride.driver_rating
                ? Number(ride.driver_rating)
                : 0,
        };
    }


    return {
        success: true,
        message: "Ride status fetched successfully.",
        data,
    };
};

export const cancelRide = async (
    userId,
    rideId,
    cancelReason = null
) => {

    return await knex.transaction(async (trx) => {

        /*
        |--------------------------------------------------------------------------
        | Find & Lock Ride
        |--------------------------------------------------------------------------
        */

        const ride = await trx("rides")
            .where("id", rideId)
            .forUpdate()
            .first();

        if (!ride) {

            throw new AppError(
                "Ride not found.",
                404
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Rider Ownership
        |--------------------------------------------------------------------------
        */

        if (Number(ride.rider_id) !== Number(userId)) {

            throw new AppError(
                "You are not authorized to cancel this ride.",
                403
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Check Ride Status
        |--------------------------------------------------------------------------
        */
        if (["cancelled", "completed", "no_driver_found"].includes(ride.status)) {
            throw new AppError(`Ride cannot be cancelled because its status is ${ride.status}.`, 400);
        }


        /*
        |--------------------------------------------------------------------------
        | Cancel Ride
        |--------------------------------------------------------------------------
        */

        const cancelledRide = await rideRepo.cancelRide(
            ride.id,
            cancelReason,
            trx
        );


        /*
        |--------------------------------------------------------------------------
        | Expire Pending Driver Requests
        |--------------------------------------------------------------------------
        */

        await trx("ride_driver_requests")
            .where("ride_id", ride.id)
            .where("status", "pending")
            .update({
                status: "expired",
                responded_at: knex.fn.now(),
                updated_at: knex.fn.now(),
            });


        /*
        |--------------------------------------------------------------------------
        | Make Assigned Driver Available
        |--------------------------------------------------------------------------
        */
        if (ride.driver_id) {

            await trx("drivers").where("id", ride.driver_id).update({
                is_available: true,
                updated_at: knex.fn.now(),
            });

        }


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return {
            success: true,
            message: "Ride cancelled successfully.",
            data: {
                ride_id: Number(cancelledRide.id),
                status: cancelledRide.status,
                cancelled_at: cancelledRide.cancelled_at,
                cancel_reason: cancelledRide.cancel_reason,
            },
        };

    });

};

export const getRideTracking = async (
    userId,
    rideId
) => {

    /*
    |--------------------------------------------------------------------------
    | Get Ride
    |--------------------------------------------------------------------------
    */
    const ride = await rideRepo.getRideTracking(
        rideId,
        userId
    );

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Latest Ride Track
    |--------------------------------------------------------------------------
    */
    const latestTrack = await rideRepo.getLatestRideTrack(rideId);

    /*
    |--------------------------------------------------------------------------
    | Driver Location
    |--------------------------------------------------------------------------
    */
    let driverLocation = null;
    let driverToPickupDistanceKm = null;
    let driverToPickupEtaMinutes = null;

    if (ride.driver_id && ride.driver_latitude != null && ride.driver_longitude != null) {

        driverLocation = {
            latitude: Number(ride.driver_latitude),
            longitude: Number(ride.driver_longitude),
            heading: ride.driver_heading != null ? Number(ride.driver_heading) : null,
            speed: ride.driver_speed != null ? Number(ride.driver_speed) : null,
            updated_at: ride.driver_location_updated_at,
        };


        /*
        |--------------------------------------------------------------------------
        | Driver -> Pickup Distance
        |--------------------------------------------------------------------------
        */
        driverToPickupDistanceKm = calculateDistanceKm(
            ride.driver_latitude,
            ride.driver_longitude,
            ride.pickup_lat,
            ride.pickup_lng
        );


        /*
        |--------------------------------------------------------------------------
        | Driver -> Pickup ETA
        |--------------------------------------------------------------------------
        */
        driverToPickupEtaMinutes = calculateEtaMinutes(
            driverToPickupDistanceKm,
            ride.driver_speed
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Latest Track
    |--------------------------------------------------------------------------
    */
    let latestRideTrack = null;

    if (latestTrack) {

        latestRideTrack = {
            latitude: latestTrack.latitude != null ? Number(latestTrack.latitude) : null,
            longitude: latestTrack.longitude != null ? Number(latestTrack.longitude) : null,
            heading: latestTrack.heading != null ? Number(latestTrack.heading) : null,
            speed: latestTrack.speed != null ? Number(latestTrack.speed) : null,
            recorded_at: latestTrack.recorded_at,
        };

    }

    const imageBaseUrl = getBaseUrl();

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */
    return {
        success: true,
        message: "Ride tracking fetched successfully.",
        data: {

            // ========================================
            // RIDE
            // ========================================
            ride: {

                id: Number(ride.ride_id),
                status: ride.ride_status,
                pickup: {
                    address: ride.pickup_address,
                    latitude: Number(ride.pickup_lat),
                    longitude: Number(ride.pickup_lng),
                },
                dropoff: {
                    address: ride.drop_address,
                    latitude: Number(ride.drop_lat),
                    longitude: Number(ride.drop_lng),
                },
                distance_km: ride.distance_km != null ? Number(ride.distance_km) : null,
                duration_minutes: ride.duration_minutes != null ? Number(ride.duration_minutes) : null,
                fare_estimate: ride.fare_estimate != null ? Number(ride.fare_estimate) : null,
                fare_final: ride.fare_final != null ? Number(ride.fare_final) : null,
                ride_picked_at: ride.ride_picked_at,
                ride_dropped_at: ride.ride_dropped_at,
            },

            // ========================================
            // RIDER
            // ========================================
            rider: ride.rider_user_id
                ? {
                    id: Number(ride.rider_user_id),
                    username: ride.rider_username,
                    phone: ride.rider_phone,
                    email: ride.rider_email,
                    avatar: ride.rider_avatar ? `${imageBaseUrl}/${ride.rider_avatar}` : null,
                    avatar: ride.rider_avatar
                    ? (
                        ride.rider_avatar.startsWith('http://') ||
                        ride.rider_avatar.startsWith('https://')
                            ? ride.rider_avatar
                            : `${imageBaseUrl}/${ride.rider_avatar}`
                    )
                    : null,
                } : null,

            // ========================================
            // DRIVER
            // ========================================
            driver: ride.driver_id 
                ? {
                    id: Number(ride.driver_id),
                    user_id: Number(ride.driver_user_id),
                    first_name: ride.driver_first_name,
                    last_name: ride.driver_last_name,
                    rating: ride.driver_rating != null ? Number(ride.driver_rating) : 0,
                    driver_personal_picture: ride.driver_personal_picture ? `${imageBaseUrl}/${ride.driver_personal_picture}` : null,
                    avatar: ride.driver_avatar ? `${imageBaseUrl}/${ride.driver_avatar}` : null,
                } : null,


            // ========================================
            // VEHICLE
            // ========================================
            vehicle: ride.vehicle_id
                ? {
                    id: Number(ride.vehicle_id),
                    make: ride.vehicle_make,
                    model: ride.vehicle_model,
                    year: ride.vehicle_year,
                    color: ride.vehicle_color,
                    registration_number: ride.vehicle_registration_number,
                    image: ride.vehicle_image ? `${imageBaseUrl}/${ride.vehicle_image}` : null,
                    type: {
                        id: Number(ride.vehicle_type_id),
                        name: ride.vehicle_type_name,
                        slug: ride.vehicle_type_slug,
                        icon: ride.vehicle_type_icon ? `${imageBaseUrl}/${ride.vehicle_type_icon}` : null,
                        map_icon: ride.vehicle_map_icon ? `${imageBaseUrl}/${ride.vehicle_map_icon}` : null,
                        seating_capacity: ride.vehicle_seating_capacity != null ? Number(ride.vehicle_seating_capacity) : null,
                        description: ride.vehicle_type_description,
                    },
                } : null,

            // ========================================
            // DRIVER LIVE LOCATION
            // ========================================
            driver_location: driverLocation,

            // ========================================
            // DRIVER ARRIVAL
            // ========================================
            driver_arrival: ride.driver_id
                ? {
                    distance_km: driverToPickupDistanceKm != null ? Number(driverToPickupDistanceKm.toFixed(2)) : null,
                    eta_minutes: driverToPickupEtaMinutes,
                } : null,

            // ========================================
            // TRACK
            // ========================================
            latest_track: latestRideTrack,

        },

    };
};

/*
|--------------------------------------------------------------------------
| Build Ride Status Notification
|--------------------------------------------------------------------------
*/
const buildRideStatusNotification = async ({
    status,
    rideId,
    driverName,
}) => {

    switch (status) {

        case "en_route_pickup":
            return await rideEnRoutePickupTemplate({rideId, driverName});

        case "arrived_pickup":
            return await driverArrivedPickupTemplate({rideId, driverName});

        case "in_progress":
            return await rideStartedTemplate({rideId, driverName});

        default:
            return null;
    }
};

/*
|--------------------------------------------------------------------------
| Update Ride Status
|--------------------------------------------------------------------------
*/
export const updateRideStatus = async ({
    rideId,
    userId,
    status,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Validate Ride ID
    |--------------------------------------------------------------------------
    */
    const parsedRideId = Number(rideId);

    if (!Number.isInteger(parsedRideId) || parsedRideId <= 0) {
        throw new AppError("Invalid ride ID.", 400);
    }


    /*
    |--------------------------------------------------------------------------
    | Validate Requested Status
    |--------------------------------------------------------------------------
    */
    const allowedStatuses = [
        "en_route_pickup",
        "arrived_pickup",
        "in_progress",
    ];

    if (!allowedStatuses.includes(status))
        throw new AppError("Invalid ride status.", 400);


    /*
    |--------------------------------------------------------------------------
    | Get Current Ride
    |--------------------------------------------------------------------------
    */
    const ride = await rideRepo.getRideStatus(parsedRideId);

    if (!ride) {
        throw new AppError("Ride not found.", 404);
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Driver Ownership
    |--------------------------------------------------------------------------
    |
    | The authenticated user must be the user account
    | belonging to the driver assigned to this ride.
    |
    */
    if (!ride.driver_user_id || Number(ride.driver_user_id) !== Number(userId))
        throw new AppError("You are not authorized to update this ride.", 403);

    /*
    |--------------------------------------------------------------------------
    | Define Valid Status Transitions
    |--------------------------------------------------------------------------
    */
    const allowedTransitions = {
        accepted: "en_route_pickup",
        en_route_pickup: "arrived_pickup",
        arrived_pickup: "in_progress",
    };

    /*
    |--------------------------------------------------------------------------
    | Check Current → Requested Transition
    |--------------------------------------------------------------------------
    */
    const expectedNextStatus = allowedTransitions[ride.ride_status];

    if (!expectedNextStatus)
        throw new AppError(`Ride cannot be updated from status "${ride.ride_status}".`, 409);

    if (expectedNextStatus !== status)
        throw new AppError(`Invalid ride status transition: ` + `${ride.ride_status} → ${status}.`, 409);


    /*
    |--------------------------------------------------------------------------
    | Atomic Update
    |--------------------------------------------------------------------------
    */
    const updatedRide = await rideRepo.updateRideStatus(
        parsedRideId,
        ride.driver_id,
        ride.ride_status,
        status
    );


    /*
    |--------------------------------------------------------------------------
    | Concurrent Update / Race Condition
    |--------------------------------------------------------------------------
    |
    | Another request may have changed the ride between our
    | initial read and the UPDATE.
    |
    */
    if (!updatedRide) {
        throw new AppError("Ride status was changed by another request. " + "Please refresh the ride.", 409);
    }

    /*
    |--------------------------------------------------------------------------
    | Notify Rider
    |--------------------------------------------------------------------------
    */
    try {

        if (ride.rider_user_id) {

            const driverName = [ride.driver_first_name, ride.driver_last_name].filter(Boolean).join(" ").trim() || "Your driver";

            const notification = await buildRideStatusNotification({
                status,
                rideId: parsedRideId,
                driverName,
            });

            if (notification) {
                await sendNotification({
                    userId: Number(ride.rider_user_id),
                    token: ride.rider_fcm_token || null,
                    type: notification.type,
                    title: notification.title,
                    body: notification.body,
                    data: notification.data,
                });
            }
        }

    } catch (notificationError) {
        console.error(`Failed to notify rider about ride ${parsedRideId}:`, notificationError);
    }


    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */
    return {
        success: true,
        message: "Ride status updated successfully.",
        data: {
            ride_id: Number(updatedRide.id),
            status: updatedRide.status,
            driver: ride.driver_id
                ? {
                    driver_id: Number(ride.driver_id),
                    user_id: Number(ride.driver_user_id),
                    first_name: ride.driver_first_name,
                    last_name: ride.driver_last_name,
                    rating: ride.driver_rating ? Number(ride.driver_rating) : 0,
                } : null,
        },
    };
};