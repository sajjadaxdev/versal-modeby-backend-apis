import knex from "../../db/knex.js"; 
import slugify from "slugify";

export const findAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const search = filters.search || "";

    const query = knex("roles")
        .leftJoin(
            "role_permissions",
            "roles.id",
            "role_permissions.role_id"
        )
        .select(
            "roles.*",
            knex.raw("COUNT(DISTINCT role_permissions.permission_id) as permission_count")
        )
        .groupBy("roles.id");

    if (search) {

        const normalizedSearch = search.replace(/[\s_-]+/g, "").toLowerCase();

        query.where(function () {
            this.whereRaw(`LOWER(regexp_replace(roles.name, '[\\s_-]+', '', 'g')) LIKE ? `, [`%${normalizedSearch}%`]);
        });
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        query.where("roles.is_active", filters.is_active === "1");
    }

    const totalQuery = knex("roles");

    if (search) {
        totalQuery.where(function () {
            this.where("name", "like", `%${search}%`).orWhere("slug", "like", `%${search}%`);
        });
    }

    if (filters.is_active !== undefined && filters.is_active !== "") {
        totalQuery.where("is_active", filters.is_active === "1");
    }

    const total = await totalQuery.count("* as count").first();

    const totalPermissionsResult = await knex("permissions")
        .count("* as count")
        .first();

    const rows = await query
        .orderBy("roles.id", "ASC")
        .offset((page - 1) * limit)
        .limit(limit);

    return {
        rows,
        totalPermissions: Number(totalPermissionsResult.count),
        total: Number(total.count),
        page,
        limit,
    };
};


export const findById = async (id) => {

    return knex("roles")
        .where({ id })
        .first();

};

export const findByName = async (name) => {

    return knex("roles")
        .where({ name })
        .first();

};

export const findBySlug = async (slug) => {
    return knex("roles").where({ slug }).first();
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

    return await knex("roles")
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

    const [role] = await knex("roles")
        .where({ id })
        .update(payload)
        .returning("*");

    return role;

};

export const remove = async (id) => {

    return knex("roles")
        .where({ id })
        .del();

};

export const existsByIds = async (ids) => {

    return knex("roles")
        .whereIn("id", ids)
        .select("id");

};