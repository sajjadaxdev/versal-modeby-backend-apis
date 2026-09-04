import knex from "../../db/knex.js";

export const create = async (data) => {
    return await knex("riders")
        .insert(data)
        .returning("*");
};

export const findByUserId = async (userId) => {
    return await knex("riders")
        .where({ user_id: userId })
        .first();
};

export const updateByUserId = async (userId, data) => {
    return await knex("riders")
        .where({ user_id: userId })
        .update(data)
        .returning("*");
};

export const deleteByUserId = async (userId) => {
    return await knex("riders")
        .where({ user_id: userId })
        .del();
};

/*
|--------------------------------------------------------------------------
| Get Active Ride For Rider Session
|--------------------------------------------------------------------------
|
| Rider active ride statuses:
|
| requested
| accepted
| en_route_pickup
| arrived_pickup
| in_progress
|
*/
export const getActiveRideByRiderId = async (riderId) => {

    return await knex("rides as r")

        // Driver
        .leftJoin("drivers as d", "d.id", "r.driver_id")

        // Driver User
        .leftJoin("users as du", "du.id", "d.user_id")

        // Vehicle
        .leftJoin("vehicles as v", "v.id", "r.vehicle_id")

        // Vehicle Type
        .leftJoin("vehicle_types as vt", "vt.id", "r.vehicle_type_id")

        .where("r.rider_id", riderId)

        .whereIn("r.status", [
            "requested",
            "accepted",
            "en_route_pickup",
            "arrived_pickup",
            "in_progress",
        ])

        .select([
            "r.id",
            "r.status",
            "r.rider_id",
            "r.driver_id",

            "r.vehicle_type_id",
            "r.vehicle_id",

            "r.pickup_address",
            "r.pickup_lat",
            "r.pickup_lng",

            "r.drop_address",
            "r.drop_lat",
            "r.drop_lng",

            "r.distance_km",
            "r.duration_minutes",

            "r.fare_estimate",
            "r.fare_final",

            "r.scheduled_time",

            "r.ride_picked_at",
            "r.ride_dropped_at",

            "r.created_at",
            "r.updated_at",

            // Driver
            "d.first_name as driver_first_name",
            "d.last_name as driver_last_name",
            "d.rating as driver_rating",
            "d.personal_picture as driver_personal_picture",

            // Driver User
            "du.id as driver_user_id",
            "du.username as driver_username",
            "du.phone as driver_phone",
            "du.avatar as driver_avatar",

            // Vehicle
            "v.make as vehicle_make",
            "v.model as vehicle_model",
            "v.year as vehicle_year",
            "v.color as vehicle_color",
            "v.registration_number as vehicle_registration_number",
            "v.vehicle_image",

            // Vehicle Type
            "vt.name as vehicle_type_name",
            "vt.slug as vehicle_type_slug",
            "vt.icon as vehicle_type_icon",
            "vt.map_icon as vehicle_type_map_icon",
            "vt.seating_capacity as vehicle_type_seating_capacity",
        ])

        .orderBy("r.id", "desc")
        .first();
};