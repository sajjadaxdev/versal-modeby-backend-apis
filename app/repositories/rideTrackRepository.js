import knex from "../../db/knex.js";

const TABLE = "ride_tracks";

/*
|--------------------------------------------------------------------------
| CREATE RIDE TRACK
|--------------------------------------------------------------------------
*/
export const create = async (data) => {

    const inserted = await knex(TABLE)
        .insert({
            ride_id: data.ride_id,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading ?? null,
            speed: data.speed ?? null,
        })
        .returning("*");

    return inserted[0];
};


/*
|--------------------------------------------------------------------------
| GET LATEST RIDE TRACK
|--------------------------------------------------------------------------
*/
export const getLatestByRideId = async (rideId) => {

    return await knex(TABLE)
        .where("ride_id", rideId)
        .orderBy("recorded_at", "desc")
        .orderBy("id", "desc")
        .first();
};


/*
|--------------------------------------------------------------------------
| GET RIDE TRACKS
|--------------------------------------------------------------------------
*/
export const getByRideId = async (rideId) => {

    return await knex(TABLE)
        .where("ride_id", rideId)
        .orderBy("recorded_at", "asc")
        .orderBy("id", "asc");
};