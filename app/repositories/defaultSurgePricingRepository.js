import knex from "../../db/knex.js";

/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("default_surge_pricings as dsp")
        .leftJoin("vehicle_types as vt", "dsp.vehicle_type_id", "vt.id")
        .select(
            "dsp.*",
            "vt.name as vehicle_type_name"
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
                `LOWER(regexp_replace(vt.name,'[\\s_-]+','','g')) LIKE ?`,
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
        query.where("dsp.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where(
            "dsp.is_active",
            filters.is_active === "1"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    const totalQuery = knex("default_surge_pricings as dsp")
        .leftJoin("vehicle_types as vt", "dsp.vehicle_type_id", "vt.id");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        totalQuery.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(vt.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });

    }

    if (filters.vehicle_type_id) {
        totalQuery.where("dsp.vehicle_type_id", filters.vehicle_type_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where(
            "dsp.is_active",
            filters.is_active === "1"
        );
    }

    const total = await totalQuery
        .countDistinct("dsp.id as count")
        .first();

    const rows = await query
        .orderBy("dsp.id", "ASC")
        .offset((page - 1) * limit)
        .limit(limit);

    return {
        rows,
        total: Number(total.count),
        page,
        limit,
    };
};

export const findById = async (id) => {
    return await knex("default_surge_pricings as dsp")
        .leftJoin("vehicle_types as vt", "dsp.vehicle_type_id", "vt.id")
        .select("dsp.*", "vt.name as vehicle_type_name")
        .where("dsp.id", id)
        .first();
};

export const findByVehicleType = async (vehicle_type_id) => {
    return await knex("default_surge_pricings")
        .where({ vehicle_type_id, is_active: true })
        .first();
};

export const findActiveByTime = async (vehicle_type_id, time) => {
    return await knex("default_surge_pricings")
        .where({ vehicle_type_id, is_active: true })
        .andWhere("start_time", "<=", time)
        .andWhere("end_time",   ">=", time)
        .first();
};

export const create = async (data) => {
    const [row] = await knex("default_surge_pricings").insert(data).returning("*");
    return row;
};

export const update = async (id, data) => {
    const [row] = await knex("default_surge_pricings").where({ id }).update(data).returning("*");
    return row;
};

export const remove = async (id) => {
    return await knex("default_surge_pricings").where({ id }).del();
};