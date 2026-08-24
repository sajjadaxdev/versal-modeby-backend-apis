import * as rolePermissionService from "../services/rolePermissionService.js";

export const getRolePermissions = async (req, res, next) => {

    try {

        const response = await rolePermissionService.getRolePermissions(
            req.params.roleId
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const syncRolePermissions = async (req, res, next) => {

    try {

        const response = await rolePermissionService.syncRolePermissions(
            req.params.roleId,
            req.body.permissions
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const removeRolePermission = async (req, res, next) => {

    try {

        const response = await rolePermissionService.removeRolePermission(
            req.params.roleId,
            req.params.permissionId
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};