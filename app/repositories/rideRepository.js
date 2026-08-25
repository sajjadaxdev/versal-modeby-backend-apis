import knex from "../../db/knex.js";

export const create = async (data) => {

    const [ride] = await knex("rides")
        .insert(data)
        .returning("*");

    return ride;
};

/*
|--------------------------------------------------------------------------
| Find Ride By ID
|--------------------------------------------------------------------------
*/

export const findById = async (id, trx = knex) => {

    return await trx("rides")
        .where("id", id)
        .first();
};


/*
|--------------------------------------------------------------------------
| Assign Driver To Ride
|--------------------------------------------------------------------------
*/

export const assignDriver = async (
    rideId,
    driverId,
    vehicleId,
    trx = knex
) => {

    const [ride] = await trx("rides")
        .where("id", rideId)
        .where("status", "requested")
        .update({
            driver_id: driverId,
            vehicle_id: vehicleId,
            status: "accepted",
            updated_at: trx.fn.now(),
        })
        .returning("*");

    return ride;
};

/**
 * Get ride status with assigned driver information.
*/
export const getRideStatus = async (rideId) => {
    return await knex("rides as r")

        .leftJoin("drivers as d", "d.id", "r.driver_id")

        // Driver user
        .leftJoin("users as du", "du.id", "d.user_id")

        // Rider user
        .leftJoin("users as ru", "ru.id", "r.rider_id")

        .where("r.id", rideId)

        .select([
            "r.id as ride_id",
            "r.rider_id",
            "r.status as ride_status",
            "r.driver_id",

            // Matching data
            "r.vehicle_type_id",
            "r.pickup_lat",
            "r.pickup_lng",

            "r.ride_picked_at",
            "r.ride_dropped_at",

            "r.fare_final",
            "r.final_duration_minutes",
            "r.final_distance_km",
            
            // Driver data
            "d.first_name as driver_first_name",
            "d.last_name as driver_last_name",
            "d.rating as driver_rating",
            "du.id as driver_user_id",

            // Rider data
            "ru.id as rider_user_id",
            "ru.username as rider_name",

            // Use your actual FCM token column name
            "ru.fcm_id as rider_fcm_token",
        ])

        .first();
};

export const updateById = async (id, data, trx = knex) => {

    const db = trx || knex;

    const [record] = await db("rides")
        .where({ id })
        .update({
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return record;
};

/**
 * Cancel ride
 */
export const cancelRide = async (
    rideId,
    cancelReason = null,
    trx = knex
) => {

    const [ride] = await trx("rides")
        .where("id", rideId)
        .update({
            status: "cancelled",
            cancelled_at: knex.fn.now(),
            cancel_reason: cancelReason,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return ride;
};

/**
 * Get complete ride tracking information
 */
export const getRideTracking = async (rideId, userId) => {

    return await knex("rides as r")

        // Driver
        .leftJoin("drivers as d", "d.id", "r.driver_id")

        // Driver user
        .leftJoin("users as u", "u.id", "d.user_id")

        // Rider user
        .leftJoin("users as ru", "ru.id", "r.rider_id")

        // Vehicle
        .leftJoin("vehicles as v", "v.id", "r.vehicle_id")

        // Vehicle type
        .leftJoin("vehicle_types as vt", "vt.id", "r.vehicle_type_id")

        // Driver current location
        .leftJoin("driver_location as dl", "dl.driver_id", "d.id")

        .where("r.id", rideId)
    
        .where(function () {
            this.where("r.rider_id", userId)
                .orWhere("d.user_id", userId);
        })

        .select([

            // --------------------------------
            // RIDER
            // --------------------------------
            "ru.id as rider_user_id",
            "ru.username as rider_username",
            "ru.phone as rider_phone",
            "ru.email as rider_email",
            "ru.avatar as rider_avatar",

            // --------------------------------
            // RIDE
            // --------------------------------
            "r.id as ride_id",
            "r.rider_id",

            "r.status as ride_status",

            "r.pickup_address",
            "r.pickup_lat",
            "r.pickup_lng",

            "r.drop_address",
            "r.drop_lat",
            "r.drop_lng",

            "r.distance_km",
            "r.duration_minutes",

            "r.final_distance_km",
            "r.final_duration_minutes",

            "r.fare_estimate",
            "r.fare_final",

            "r.ride_picked_at",
            "r.ride_dropped_at",

            "r.created_at",
            "r.updated_at",

            // --------------------------------
            // DRIVER
            // --------------------------------
            "d.id as driver_id",
            "d.user_id as driver_user_id",
            "d.first_name as driver_first_name",
            "d.last_name as driver_last_name",
            "d.rating as driver_rating",
            "d.personal_picture as driver_personal_picture",

            // ========================================
            // DRIVER USER
            // ========================================
            "u.avatar as driver_avatar",

            // --------------------------------
            // VEHICLE
            // --------------------------------

            "v.id as vehicle_id",
            "v.make as vehicle_make",
            "v.model as vehicle_model",
            "v.year as vehicle_year",
            "v.color as vehicle_color",
            "v.registration_number as vehicle_registration_number",
            "v.vehicle_image",

            // --------------------------------
            // VEHICLE TYPE
            // --------------------------------
            "vt.id as vehicle_type_id",
            "vt.name as vehicle_type_name",
            "vt.slug as vehicle_type_slug",
            "vt.icon as vehicle_type_icon",
            "vt.map_icon as vehicle_map_icon",
            "vt.seating_capacity as vehicle_seating_capacity",
            "vt.description as vehicle_type_description",

            // --------------------------------
            // DRIVER LOCATION
            // --------------------------------
            "dl.latitude as driver_latitude",
            "dl.longitude as driver_longitude",
            "dl.heading as driver_heading",
            "dl.speed as driver_speed",
            "dl.last_update as driver_location_updated_at",
        ])

        .first();
};

/**
 * Get latest ride tracking point
 */
export const getLatestRideTrack = async (rideId) => {

    return await knex("ride_tracks")
        .where("ride_id", rideId)
        .orderBy("recorded_at", "desc")
        .first();
};

/*
|--------------------------------------------------------------------------
| Update Ride Status
|--------------------------------------------------------------------------
|
| Atomic status transition.
|
| The update will only happen when:
|
| - ride ID matches
| - assigned driver matches
| - current ride status matches expected status
|
*/

export const updateRideStatus = async (
    rideId,
    driverId,
    currentStatus,
    newStatus,
    completionData = null,
    trx = knex
) => {

    const db = trx || knex;

    /*
    |--------------------------------------------------------------------------
    | Base Update Data
    |--------------------------------------------------------------------------
    */
    const updateData = {
        status: newStatus,
        updated_at: db.fn.now(),
    };


    /*
    |--------------------------------------------------------------------------
    | Ride Started
    |--------------------------------------------------------------------------
    |
    | Store the exact time when the driver starts the ride.
    |
    */
    if (currentStatus === "arrived_pickup" && newStatus === "in_progress") {
        updateData.ride_picked_at = db.fn.now();
    }


    /*
    |--------------------------------------------------------------------------
    | Ride Completed
    |--------------------------------------------------------------------------
    |
    | Store the exact time when the driver completes the ride.
    |
    */
    if (currentStatus === "in_progress" && newStatus === "completed") {
        updateData.ride_dropped_at  = completionData?.ride_dropped_at ?? db.fn.now();

        updateData.final_distance_km      = completionData?.final_distance_km ?? 0;
        updateData.final_duration_minutes = completionData?.final_duration_minutes ?? 0;

        updateData.fare_final       = completionData?.fare_final ?? 0;
    }


    /*
    |--------------------------------------------------------------------------
    | Atomic Update
    |--------------------------------------------------------------------------
    */
    const [ride] = await db("rides")
        .where("id", rideId)
        .where("driver_id", driverId)
        .where("status", currentStatus)
        .update(updateData)
        .returning("*");

    return ride;
};
