import knex from "../../db/knex.js";
import {getPrefix} from "../helpers/commonHelper.js";
/*
|--------------------------------------------------------------------------
| Find All
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = filters.search || "";

    const query = knex("franchises")
        .leftJoin("business", "franchises.business_id", "business.id")
        .leftJoin("vehicle_owners", function () {
            this.on("franchises.id", "=", "vehicle_owners.owner_id")
                .andOn(
                    knex.raw("vehicle_owners.owner_type = ?", ["franchise"])
                );
        })
        .select(
            "franchises.*",
            "business.name as business_name",
            knex.raw("COUNT(DISTINCT vehicle_owners.vehicle_id) as vehicle_count")
        )
        .groupBy(
            "franchises.id",
            "business.id",
            "business.name"
        );

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        query.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(franchises.name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhereRaw(
                `LOWER(regexp_replace(franchises.code,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhereRaw(
                `LOWER(regexp_replace(COALESCE(franchises.address,''),'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });

    }

    if (filters.business_id) {
        query.where("franchises.business_id", filters.business_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where(
            "franchises.is_active",
            filters.is_active === "1"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Total Records
    |--------------------------------------------------------------------------
    */

    const totalQuery = knex("franchises");

    if (search) {

        const normalizedSearch = search
            .replace(/[\s_-]+/g, "")
            .toLowerCase();

        totalQuery.where(function () {

            this.whereRaw(
                `LOWER(regexp_replace(name,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhereRaw(
                `LOWER(regexp_replace(code,'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            )
            .orWhereRaw(
                `LOWER(regexp_replace(COALESCE(address,''),'[\\s_-]+','','g')) LIKE ?`,
                [`%${normalizedSearch}%`]
            );

        });

    }

    if (filters.business_id) {
        totalQuery.where("business_id", filters.business_id);
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where(
            "is_active",
            filters.is_active === "1"
        );
    }

    const total = await totalQuery
        .count("* as count")
        .first();

    const rows = await query
        .orderBy("franchises.id", "ASC")
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
| Find By Id
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    return knex("franchises")
        .where({ id })
        .first();

};

/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/

export const findByName = async (name) => {

    return knex("franchises")
        .where({
            name
        })
        .first();

};

/*
|--------------------------------------------------------------------------
| Find By Code
|--------------------------------------------------------------------------
*/

export const findByCode = async ( code) => {

    return knex("franchises")
        .where({
            code
        })
        .first();

};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const [franchise] = await knex("franchises")
        .insert(data)
        .returning("*");

    return franchise;

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const [franchise] = await knex("franchises")
        .where({ id })
        .update(data)
        .returning("*");

    return franchise;

};

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    return knex("franchises")
        .where({ id })
        .del();

};

export const getNextCode = async (
    businessName,
    franchiseName,
    franchiseId = null
) => {

    const businessPrefix = getPrefix(businessName, 3);
    const franchisePrefix = getPrefix(franchiseName, 3);

    const prefix = `${businessPrefix}-${franchisePrefix}`;

    let number;

    if (franchiseId) {

        number = franchiseId;

    } else {

        const result = await knex("franchises")
            .count("id as total")
            .first();

        number = Number(result.total) + 1;

    }

    return `${prefix}-${String(number).padStart(4, "0")}`;

};

// export const getNextCode = async (businessName, franchiseName, franchiseId= null) => {

//     const businessPrefix = getPrefix(businessName, 3);
//     const franchisePrefix = getPrefix(franchiseName, 3);

//     const prefix = `${businessPrefix}-${franchisePrefix}`;

//     const last = await knex("franchises")
//         .select("code")
//         .orderBy("id", "desc")
//         .first();

//     let number = 1;

//     if (last) {
//         number = parseInt(last.code.split("-").pop(), 10) + 1;
//     }

//     return `${prefix}-${String(number).padStart(4, "0")}`;

// };