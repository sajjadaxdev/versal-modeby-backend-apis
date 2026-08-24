import knex from "../../db/knex.js"; 
import { getBaseUrl } from "../helpers/fileHelper.js";

/*
|--------------------------------------------------------------------------
| Get All Vehicle Types
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("vehicle_types")
        .leftJoin("vehicles", "vehicle_types.id", "vehicles.vehicle_type_id");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        query.whereRaw(
            `LOWER(regexp_replace(vehicle_types.name, '[\\s_-]+', '', 'g')) LIKE ?`,
            [`%${normalizedSearch}%`]
        );

    }

    if (filters.is_active !== undefined && filters.is_active !== "") {

        query.where(
            "vehicle_types.is_active",
            Number(filters.is_active)
        );

    }

    const total = await knex("vehicle_types")
        .modify((builder) => {

            if (search) {
                const normalizedSearch = search
                    .replace(/[\s_-]+/g, "")
                    .toLowerCase();

                builder.whereRaw(
                    `LOWER(regexp_replace(name, '[\\s_-]+', '', 'g')) LIKE ?`,
                    [`%${normalizedSearch}%`]
                );
            }

            if (filters.is_active !== undefined && filters.is_active !== "") {
                builder.where("is_active", Number(filters.is_active));
            }

        })
        .count("* as count")
        .first();

    const rows = await query.select(
        "vehicle_types.*",
        knex.raw("COUNT(vehicles.id)::int AS vehicles_count")
    )
    .groupBy("vehicle_types.id")
    .orderBy("vehicle_types.display_order", "ASC")
    .limit(limit)
    .offset((page - 1) * limit);

    const imageBaseUrl = getBaseUrl();

    const data = rows.map((item) => ({
        ...item,
        iconFull: item.icon ? `${imageBaseUrl}/${item.icon}` : null,
    }));

    return {
        rows: data,
        total: Number(total.count),
        page,
        limit,
    };

};
/*
|--------------------------------------------------------------------------
| Find Vehicle Type By Id
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    const vehicleType = await knex("vehicle_types")
        .where({ id })
        .first();
        
    const imageBaseUrl = getBaseUrl();

    vehicleType.iconFull = vehicleType.icon ? `${imageBaseUrl}/${vehicleType.icon}` : null;

    return vehicleType;

};

/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/

export const findByName = async (name) => {

    return await knex("vehicle_types")
        .whereRaw("LOWER(name) = LOWER(?)", [name.trim()])
        .first();

};

/*
|--------------------------------------------------------------------------
| Create Vehicle Type
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const [vehicleType] = await knex("vehicle_types")
        .insert(data)
        .returning("*");

    return vehicleType;

};

/*
|--------------------------------------------------------------------------
| Update Vehicle Type
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const [vehicleType] = await knex("vehicle_types")
        .where({ id })
        .update(data)
        .returning("*");

    return vehicleType;

};

/*
|--------------------------------------------------------------------------
| Delete Vehicle Type
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    return await knex("vehicle_types")
        .where({ id })
        .del();

};