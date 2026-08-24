import knex from "../../db/knex.js"; 
import slugify from "slugify";

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = filters.search || "";

    const query = knex("permissions");

    if (search) {

        const normalizedSearch = search.replace(/[\s_-]+/g, "").toLowerCase();

        query.where(function () {
            this.whereRaw(`LOWER(regexp_replace(name, '[\\s_-]+', '', 'g')) LIKE ? `, [`%${normalizedSearch}%`]);
        });
    }

    const totalQuery = query.clone();

    const total = await totalQuery.count("* as count").first();

    const rows = await query
        .orderBy("id", "ASC")
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

    return knex("permissions")
        .where({ id })
        .first();

};

export const findIds = async (ids) => {

    return knex("permissions")
        .whereIn("id", ids)
        .pluck("id");

};

export const findByName = async (name) => {

    return knex("permissions")
        .where({ name })
        .first();

};

export const findBySlug = async (slug) => {

    return knex("permissions")
        .where({ slug })
        .first();

};

export const create = async (data) => {

    const payload = {
        ...data,
        slug: slugify(data.name, {
            lower: true,
            strict: true,
            trim: true,
        }),
    };

    return await knex("permissions")
        .insert(payload)
        .returning("*");

};

export const update = async (id, data) => {

    const payload = {
        ...data,
        slug: slugify(data.name, {
            lower: true,
            strict: true,
            trim: true,
        }),
    };

    const [role] = await knex("permissions")
        .where({ id })
        .update(payload)
        .returning("*");

    return role;

};

export const remove = async (id) => {

    return knex("permissions")
        .where({ id })
        .del();

};