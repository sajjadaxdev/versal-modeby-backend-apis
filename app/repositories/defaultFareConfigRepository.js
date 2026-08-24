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

    const query = knex("default_fare_configs")
        .leftJoin("vehicle_types", "default_fare_configs.vehicle_type_id", "vehicle_types.id")
        .select(
            "default_fare_configs.*",
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

            this.WhereRaw(
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

    if (filters.vehicle_type_id) {
        query.where("default_fare_configs.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where(
            "default_fare_configs.is_active",   Number(filters.is_active)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const totalQuery = knex("default_fare_configs")
        .leftJoin("vehicle_types", "default_fare_configs.vehicle_type_id", "vehicle_types.id");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        totalQuery.where(function () {

            this.WhereRaw(
                `LOWER(regexp_replace(vehicle_types.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });

    }

    if (filters.vehicle_type_id) {
        totalQuery.where("default_fare_configs.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where(
            "default_fare_configs.is_active",
            filters.is_active === "1"
        );
    }

    const total = await totalQuery
        .countDistinct("default_fare_configs.id as count")
        .first();

    const rows = await query
        .orderBy("default_fare_configs.id", "ASC")
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

    return knex("default_fare_configs")
        .leftJoin("vehicle_types", "default_fare_configs.vehicle_type_id", "vehicle_types.id")
        .select(
            "default_fare_configs.*",
            "vehicle_types.name as vehicle_type_name"
        )
        .where("default_fare_configs.id", id)
        .first();

};

/*
|--------------------------------------------------------------------------
| Duplicate Check
|--------------------------------------------------------------------------
*/

export const findDuplicate = async (
    vehicle_type_id,
    ignoreId = null
) => {

    const query = knex("default_fare_configs")
        .where({
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

    const [row] = await knex("default_fare_configs")
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

    const [row] = await knex("default_fare_configs")
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

    await knex("default_fare_configs")
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

    return knex("default_fare_configs")
        .where({ id })
        .del();

};