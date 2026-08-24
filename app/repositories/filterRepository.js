import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| Vehicle Types Filter
|--------------------------------------------------------------------------
*/

export const getVehicleTypes = async () => {

    return await knex("vehicle_types")
        .select(
            "id",
            knex.raw(`CONCAT(name, ' | ', seating_capacity, ' Seats') AS name`),
            "description",
        )
        .where("is_active", true)
        .orderBy("display_order", "asc");
};

/*
|--------------------------------------------------------------------------
| Vehicle Owner Filters
|--------------------------------------------------------------------------
*/

export const getVehicleOwners = async () => {

    const businesses = await knex("business")
        .select("id", "name")
        .where("is_active", true)
        .orderBy("name");

    const franchises = await knex("franchises")
        .select("id", "name")
        .where("is_active", true)
        .where("is_head_office", false)
        .orderBy("name");

    const drivers = await knex("drivers")
        .join("users", "users.id", "drivers.user_id")
        .select(
            "drivers.id",
            "users.username as name"
        )
        .where("users.is_active", true)
        .orderBy("users.username");

    // const partners = await knex("partners").select("id", "name").where("is_active", true).orderBy("name");
    const partners = [];
    return {
        business: businesses,
        franchise: franchises,
        driver: drivers,
        partner: partners,
    };

};

/*
|--------------------------------------------------------------------------
| Cities Filter
|--------------------------------------------------------------------------
*/

export const getCities = async () => {

    return await knex("cities")
        .select(
            "id",
            "name",
            "latitude",
            "longitude",
        )
        .where("is_active", true);
};
