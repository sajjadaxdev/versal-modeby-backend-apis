import knex from "../../db/knex.js";

export const findAll = async (filters) => {
    const page  = Number(filters.page  || 1);
    const limit = Number(filters.limit || 10);
    const search = (filters.search || "").trim();

    const query = knex("currency_configs");

    if (search) {
        query.where(function () {
            this.where("name", "ilike", `%${search}%`)
                .orWhere("code", "ilike", `%${search}%`)
                .orWhere("symbol", "ilike", `%${search}%`);
        });
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where("is_active", Number(filters.is_active));
    }

    const total = await query.clone().count("* as count").first();

    const rows = await query
        .select("*")
        .orderBy("id", "DESC")
        .limit(limit)
        .offset((page - 1) * limit);

    return { rows, total: Number(total.count), page, limit };
};

export const findById = async (id) => {
    return await knex("currency_configs").where({ id }).first();
};

export const findByCode = async (code) => {
    return await knex("currency_configs")
        .whereRaw("LOWER(code) = LOWER(?)", [code])
        .first();
};

export const findDefault = async () => {
    return await knex("currency_configs").where({ is_default: true }).first();
};

export const create = async (data) => {
    const [row] = await knex("currency_configs").insert(data).returning("*");
    return row;
};

export const update = async (id, data) => {
    const [row] = await knex("currency_configs").where({ id }).update(data).returning("*");
    return row;
};

export const clearDefault = async () => {
    return await knex("currency_configs").update({ is_default: false });
};

export const remove = async (id) => {
    return await knex("currency_configs").where({ id }).del();
};

export const clearActive = async (excludeId = null) => {
    const query = knex("currency_configs").update({ is_active: false });
    if (excludeId) query.whereNot("id", excludeId);
    return await query;
};

export const findActive = async () => {
    return await knex("currency_configs").where({ is_active: true }).first();
};