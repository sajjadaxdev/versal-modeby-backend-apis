import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| Get Active Cities
|--------------------------------------------------------------------------
*/

export const getActiveCities = async () => {

    return await knex("cities")
        .select(
            "id",
            "name",
            "latitude",
            "longitude",
            "geojson"
        )
        .where("is_active", true);

};