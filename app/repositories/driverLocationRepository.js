import knex from "../../db/knex.js";

const TABLE = "driver_location";

export const upsert = async (data) => {

    const existing = await knex(TABLE)
        .where("driver_id", data.driver_id)
        .first();

    if (existing) {

        const updated = await knex(TABLE)
            .where("driver_id", data.driver_id)
            .update({
                latitude: data.latitude,
                longitude: data.longitude,
                heading: data.heading,
                speed: data.speed,
                last_update: knex.fn.now(),
            })
            .returning("*");

        return updated[0];
    }

    const inserted = await knex(TABLE)
        .insert({
            driver_id: data.driver_id,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
            speed: data.speed,
        })
        .returning("*");

    return inserted[0];
};

export const findByDriverId = async (driverId) => {

    return await knex(TABLE)
        .where("driver_id", driverId)
        .first();
};