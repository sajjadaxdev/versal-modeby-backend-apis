import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {
    
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = filters.search || "";

    const query = knex("fare_configs")
        .leftJoin("cities", "fare_configs.city_id", "cities.id")
        .leftJoin("vehicle_types", "fare_configs.vehicle_type_id", "vehicle_types.id")
        .select(
            "fare_configs.*",
            "cities.name as city_name",
            "vehicle_types.name as vehicle_type_name"
        );

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {
        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        query.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(cities.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )

            .orWhereRaw(
                `LOWER(regexp_replace(vehicle_types.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });
    }

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    if (filters.city_id) {
        query.where("fare_configs.city_id", filters.city_id);
    }

    if (filters.vehicle_type_id) {
        query.where("fare_configs.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where(
            "fare_configs.is_active",
            filters.is_active === "1"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const totalQuery = knex("fare_configs")
        .leftJoin("cities", "fare_configs.city_id", "cities.id")
        .leftJoin("vehicle_types", "fare_configs.vehicle_type_id", "vehicle_types.id");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        totalQuery.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(cities.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )

            .orWhereRaw(
                `LOWER(regexp_replace(vehicle_types.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });

    }

    if (filters.city_id) {
        totalQuery.where("fare_configs.city_id", filters.city_id);
    }

    if (filters.vehicle_type_id) {
        totalQuery.where("fare_configs.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where(
            "fare_configs.is_active",
            filters.is_active === "1"
        );
    }

    const total = await totalQuery
        .countDistinct("fare_configs.id as count")
        .first();

    const rows = await query
        .orderBy("fare_configs.id", "ASC")
        .offset((page - 1) * limit)
        .limit(limit);

    return {
        rows,
        total: Number(total.count),
        page,
        limit,
    };
};

/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    return knex("fare_configs")
        .leftJoin("cities", "fare_configs.city_id", "cities.id")
        .leftJoin("vehicle_types", "fare_configs.vehicle_type_id", "vehicle_types.id")
        .select(
            "fare_configs.*",
            "cities.name as city_name",
            "vehicle_types.name as vehicle_type_name"
        )
        .where("fare_configs.id", id)
        .first();

};

/*
|--------------------------------------------------------------------------
| Duplicate Check
|--------------------------------------------------------------------------
*/

export const findDuplicate = async (
    city_id,
    vehicle_type_id,
    ignoreId = null
) => {

    const query = knex("fare_configs")
        .where({
            city_id,
            vehicle_type_id,
        });

    if (ignoreId) {
        query.whereNot("id", ignoreId);
    }

    return query.first();

};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const [row] = await knex("fare_configs")
        .insert(data)
        .returning("*");

    return row;

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const [row] = await knex("fare_configs")
        .where({ id })
        .update(data)
        .returning("*");

    return row;

};

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateStatus = async (id, data) => {

    await knex("fare_configs")
        .where({ id })
        .update({
            is_active: data.is_active
        });

    return true;

};

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    return knex("fare_configs")
        .where({ id })
        .del();

};