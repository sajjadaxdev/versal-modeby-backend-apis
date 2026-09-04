import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| Find Ride For Rating
|--------------------------------------------------------------------------
*/

export const findRideForRating = async (rideId) => {

    return await knex("rides")
        .where("rides.id", rideId)
        .select(
            "rides.id",
            "rides.rider_id",
            "rides.driver_id",
            "rides.status"
        )
        .first();

};

/*
|--------------------------------------------------------------------------
| Find Driver User
|--------------------------------------------------------------------------
*/

export const findDriverUser = async (driverId) => {

    if (!driverId) {
        return null;
    }

    return await knex("drivers")
        .where("drivers.id", driverId)
        .select(
            "drivers.id",
            "drivers.user_id"
        )
        .first();

};

/*
|--------------------------------------------------------------------------
| Find Existing Rating
|--------------------------------------------------------------------------
*/

export const findByRideAndRater = async (rideId, ratedBy) => {

    return await knex("ratings")
        .where({
            ride_id: rideId,
            rated_by: ratedBy,
        })
        .select(
            "id",
            "ride_id",
            "rated_by",
            "rated_user",
            "score",
            "comment",
            "created_at"
        )
        .first();

};

/*
|--------------------------------------------------------------------------
| Create Rating
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const [rating] = await knex("ratings")
        .insert(data)
        .returning([
            "id",
            "ride_id",
            "rated_by",
            "rated_user",
            "score",
            "comment",
            "created_at",
        ]);

    return rating;

};