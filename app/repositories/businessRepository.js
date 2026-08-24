import knex from "../../db/knex.js"; 
import { getBaseUrl } from "../helpers/fileHelper.js";

/*
|--------------------------------------------------------------------------
| Get All Businesses
|--------------------------------------------------------------------------
*/

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("business");

    if (search) {

        const normalizedSearch = search.replace(/[\s_-]+/g, "").toLowerCase();

        query.where(function () {
            this.whereRaw(`LOWER(regexp_replace(name, '[\\s_-]+', '', 'g')) LIKE ? `, [`%${normalizedSearch}%`])
            .orWhereRaw(`LOWER(regexp_replace(address,'[\\s_-]+', '', 'g')) LIKE ? `, [`%${normalizedSearch}%`])
            .orWhere("email", "like", `%${search}%`)
            .orWhere("phone", "like", `%${search}%`);

        });

    }

    if (filters.is_active !== undefined && filters.is_active !== "") {

        query.where(
            "is_active",
            Number(filters.is_active)
        );

    }

    const totalQuery = query.clone();

    const total = await totalQuery
        .count("* as count")
        .first();

    const rows = await query
    .leftJoin(
        "franchises",
        "business.id",
        "franchises.business_id"
    )
    .select(
        "business.*",
        knex.raw("COUNT(franchises.id) AS franchise_count")
    )
    .groupBy("business.id")
    .orderBy("business.id", "DESC")
    .limit(limit)
    .offset((page - 1) * limit);

    const imageBaseUrl = getBaseUrl();

    const data = rows.map((item) => ({
        ...item,
        logoFull: item.logo ? `${imageBaseUrl}/${item.logo}` : null,
    }));

    return {
        rows: data,
        total: Number(total.count),
        page,
        limit,

    };

};

export const getBusiness = async (id) => {

    const business = await knex("business")
        .select("*")
        .first();

    if (!business) {
        return null;
    }

    const imageBaseUrl = getBaseUrl();

    business.logoFull = business.logo ? `${imageBaseUrl}/${business.logo}` : null;

    return business;

};

/*
|--------------------------------------------------------------------------
| Find By Id
|--------------------------------------------------------------------------
*/

export const findById = async (id) => {

    const business = await knex("business")
        .leftJoin(
            "franchises",
            "business.id",
            "franchises.business_id"
        )
        .select(
            "business.*",
            knex.raw("COUNT(franchises.id) AS franchise_count")
        )
        .where("business.id", id)
        .groupBy("business.id")
        .first();

    if (!business) {
        return null;
    }

    const imageBaseUrl = getBaseUrl();

    business.logoFull = business.logo ? `${imageBaseUrl}/${business.logo}` : null;

    return business;

};


/*
|--------------------------------------------------------------------------
| Find By Name
|--------------------------------------------------------------------------
*/

export const findByName = async (name) => {

    return await knex("business")
        .whereRaw("LOWER(name)=LOWER(?)", [name])
        .first();

};


/*
|--------------------------------------------------------------------------
| Find By Email
|--------------------------------------------------------------------------
*/

export const findByEmail = async (email) => {

    if (!email) return null;

    return await knex("business")
        .where({ email })
        .first();

};


/*
|--------------------------------------------------------------------------
| Find By Phone
|--------------------------------------------------------------------------
*/

export const findByPhone = async (phone) => {

    if (!phone) return null;

    return await knex("business")
        .where({ phone })
        .first();

};


/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const [business] = await knex("business")
        .insert(data)
        .returning("*");

    return business;

};


/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const [business] = await knex("business")
        .where({ id })
        .update(data)
        .returning("*");

    return business;

};


/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    return await knex("business")
        .where({ id })
        .del();

};