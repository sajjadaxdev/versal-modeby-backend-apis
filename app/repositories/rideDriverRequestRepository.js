import knex from "../../db/knex.js";


/*
|--------------------------------------------------------------------------
| Create Driver Request
|--------------------------------------------------------------------------
*/

export const create = async (data, trx = knex) => {

    const [request] = await trx("ride_driver_requests")
        .insert(data)
        .returning("*");

    return request;
};


/*
|--------------------------------------------------------------------------
| Find Request By ID
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    return await knex("ride_driver_requests")
        .where("id", id)
        .first();
};


/*
|--------------------------------------------------------------------------
| Find Pending Request For Driver
|--------------------------------------------------------------------------
*/

export const findPendingByDriver = async (
    rideId,
    driverId
) => {

    return await knex("ride_driver_requests")
        .where("ride_id", rideId)
        .where("driver_id", driverId)
        .where("status", "pending")
        .first();
};

/*
|--------------------------------------------------------------------------
| Update Request Status
|--------------------------------------------------------------------------
*/

export const updateStatus = async (
    id,
    status,
    data = {},
    trx = knex
) => {

    const [request] = await trx("ride_driver_requests")
        .where("id", id)
        .update({
            status,
            ...data,
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return request;
};

export const findPendingByUserId = async (userId) => {

    return await knex("ride_driver_requests as rdr")
        .join("drivers as d", "d.id", "rdr.driver_id")
        .join("rides as r", "r.id", "rdr.ride_id")
        
        .where("d.user_id", userId)
        .where("rdr.status", "pending")

        // Request expire check
        .whereRaw("rdr.expires_at > NOW()")

        .select([
            "rdr.id as request_id",
            "rdr.ride_id",
            "rdr.status",
            "rdr.requested_at",
            "rdr.responded_at",
            "rdr.expires_at",

            "r.pickup_address",
            "r.pickup_lat",
            "r.pickup_lng",

            "r.drop_address",
            "r.drop_lat",
            "r.drop_lng",

            "r.distance_km",
            "r.duration_minutes",
            "r.fare_estimate",
            "r.vehicle_type_id",
        ])

        .orderBy("rdr.requested_at", "asc");
};

/*
|--------------------------------------------------------------------------
| Find Pending Request For Driver
|--------------------------------------------------------------------------
*/

export const findPendingByDriverAndRequest = async (
    requestId,
    driverId,
    trx = knex
) => {

    return await trx("ride_driver_requests")
        .where("id", requestId)
        .where("driver_id", driverId)
        .where("status", "pending")
        .first();
};


export const findAttemptedDriverIds = async (
    rideId,
    trx = knex
) => {

    const db = trx || knex;

    const rows = await db("ride_driver_requests")
        .where("ride_id", rideId)
        .select("driver_id");

    return rows.map(row => Number(row.driver_id));
};

/*
|--------------------------------------------------------------------------
| Find Active Pending Request For Ride
|--------------------------------------------------------------------------
*/

export const findActivePendingByRideId = async (
    rideId,
    trx = knex
) => {

    return await trx("ride_driver_requests")
        .where("ride_id", rideId)
        .where("status", "pending")
        .where("expires_at", ">", knex.fn.now())
        .orderBy("requested_at", "asc")
        .first();
};


/*
|--------------------------------------------------------------------------
| Find Expired Pending Request For Ride
|--------------------------------------------------------------------------
*/

export const findExpiredPendingByRideId = async (
    rideId,
    trx = knex
) => {

    return await trx("ride_driver_requests")
        .where("ride_id", rideId)
        .where("status", "pending")
        .where("expires_at", "<=", knex.fn.now())
        .orderBy("requested_at", "asc")
        .first();
};


/*
|--------------------------------------------------------------------------
| Expire Pending Request
|--------------------------------------------------------------------------
*/

export const expireRequest = async (
    requestId,
    trx = knex
) => {

    const [request] = await trx("ride_driver_requests")
        .where("id", requestId)
        .where("status", "pending")
        .update({
            status: "expired",
            updated_at: knex.fn.now(),
        })
        .returning("*");

    return request;
};