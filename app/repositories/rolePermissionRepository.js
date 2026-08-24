import knex from "../../db/knex.js"; 

export const getPermissions = async (roleId) => {

    return knex("role_permissions")
        .join(
            "permissions",
            "permissions.id",
            "role_permissions.permission_id"
        )
        .select(
            "permissions.id",
            "permissions.name",
            "permissions.slug",
            "permissions.description"
        )
        .where("role_permissions.role_id", roleId)
        .orderBy("permissions.name");

};

export const sync = async (roleId, permissions) => {

    await knex.transaction(async (trx) => {

        await trx("role_permissions").where({role_id: roleId,}).del();

        if (permissions.length > 0) {

            const rows = permissions.map(permissionId => ({
                role_id: roleId,
                permission_id: permissionId,
            }));

            await trx("role_permissions").insert(rows);

        }

    });

};

export const remove = async (roleId, permissionId) => {

    return knex("role_permissions").where({
        role_id: roleId,
        permission_id: permissionId,
    }).del();

};

export const getUserRolesAndPermissions = async (userId) => {

    const roles = await knex("user_roles as ur")
        .join("roles as r", "r.id", "ur.role_id")
        .where("ur.user_id", userId)
        .select(
            "r.id",
            "r.name",
            "r.slug"
        );

    const permissions = await knex("user_roles as ur")
        .join("role_permissions as rp", "rp.role_id", "ur.role_id")
        .join("permissions as p", "p.id", "rp.permission_id")
        .where("ur.user_id", userId)
        .distinct(
            "p.id",
            "p.name",
            "p.slug"
        );

    return {
        roles,
        permissions,
    };

};