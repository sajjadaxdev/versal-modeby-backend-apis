import knex from "../../db/knex.js"; 

export const findRolesByUser = async (userId) => {

    return knex("user_roles as ur")
        .join("roles as r", "r.id", "ur.role_id")
        .where("ur.user_id", userId)
        .select(
            "r.id",
            "r.name",
            "r.slug",
            "r.description",
            "r.is_active"
        );
};

export const getRoleIdsByUser = async (userId) => {

    return knex("user_roles")
        .where({
            user_id: userId,
        })
        .select("role_id");
};

export const assign = async (userId, roles) => {

    const rows = roles.map(roleId => ({
        user_id: userId,
        role_id: roleId,
    }));

    return knex("user_roles").insert(rows);
};

export const sync = async (userId, roles) => {

    await knex.transaction(async (trx) => {

        await trx("user_roles").where({user_id: userId}).del();

        if (roles.length > 0) {

            const rows = roles.map(roleId => ({
                user_id: userId,
                role_id: roleId,
            }));

            await trx("user_roles").insert(rows);
        }

    });
};

export const remove = async (userId, roleId) => {

    return knex("user_roles")
        .where({
            user_id: userId,
            role_id: roleId,
        })
        .del();
};