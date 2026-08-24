import knex from "../../db/knex.js";

export const findAll = async (filters) => {
    const page   = Number(filters.page  || 1);
    const limit  = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    // ── Reusable filter function ──
    const applyFilters = (q) => {

        if (search) {
            const n = search.replace(/[\s_-]+/g, "").toLowerCase();
            q.where(function () {
                this.whereRaw(`LOWER(regexp_replace(vt.name,'[\\s_-]+','','g')) LIKE ?`, [`%${n}%`])
                    .orWhereRaw(`LOWER(regexp_replace(c.name,'[\\s_-]+','','g')) LIKE ?`,  [`%${n}%`]);
            });
        }

        if (filters.city_id)         q.where("sp.city_id",         filters.city_id);
        if (filters.vehicle_type_id) q.where("sp.vehicle_type_id", filters.vehicle_type_id);
        if (filters.is_active !== undefined && filters.is_active !== "") {
            q.where("sp.is_active", filters.is_active === "1");
        }

        return q;
    };

    // ── Total query — alag, sirf count ──
    const totalQuery = knex("surge_pricings as sp")
        .leftJoin("vehicle_types as vt", "sp.vehicle_type_id", "vt.id")
        .leftJoin("cities as c",         "sp.city_id",         "c.id")
        .countDistinct("sp.id as count");

    applyFilters(totalQuery);
    const total = await totalQuery.first();

    // ── Rows query — data fetch ──
    const rowsQuery = knex("surge_pricings as sp")
        .leftJoin("vehicle_types as vt", "sp.vehicle_type_id", "vt.id")
        .leftJoin("cities as c",         "sp.city_id",         "c.id")
        .select("sp.*", "vt.name as vehicle_type_name", "c.name as city_name");

    applyFilters(rowsQuery);

    const rows = await rowsQuery
        .orderBy("sp.id", "ASC")
        .limit(limit)
        .offset((page - 1) * limit);

    return { rows, total: Number(total.count), page, limit };
};

export const findById = async (id) => {
    return await knex("surge_pricings as sp")
        .leftJoin("vehicle_types as vt", "sp.vehicle_type_id", "vt.id")
        .leftJoin("cities as c",         "sp.city_id",         "c.id")
        .select("sp.*", "vt.name as vehicle_type_name", "c.name as city_name")
        .where("sp.id", id)
        .first();
};

export const findActiveByTime = async (city_id, vehicle_type_id, time) => {
    return await knex("surge_pricings")
        .where({ city_id, vehicle_type_id, is_active: true })
        .andWhere("start_time", "<=", time)
        .andWhere("end_time",   ">=", time)
        .first();
};

export const create = async (data) => {
    const [row] = await knex("surge_pricings").insert(data).returning("*");
    return row;
};

export const update = async (id, data) => {
    const [row] = await knex("surge_pricings").where({ id }).update(data).returning("*");
    return row;
};

export const remove = async (id) => {
    return await knex("surge_pricings").where({ id }).del();
};