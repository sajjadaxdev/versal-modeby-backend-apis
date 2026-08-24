import * as userRoleService from "../services/userRoleService.js";

export const getUserRoles = async (req, res, next) => {
    try {

        const response = await userRoleService.getUserRoles(req.params.userId);

        res.json(response);

    } catch (error) {
        next(error);
    }
};

export const assignUserRoles = async (req, res, next) => {
    try {

        const response = await userRoleService.assignUserRoles(
            req.params.userId,
            req.body.roles
        );

        res.json(response);

    } catch (error) {
        next(error);
    }
};

export const syncUserRoles = async (req, res, next) => {
    try {

        const response = await userRoleService.syncUserRoles(
            req.params.userId,
            req.body.roles
        );

        res.json(response);

    } catch (error) {
        next(error);
    }
};

export const removeUserRole = async (req, res, next) => {
    try {

        const response = await userRoleService.removeUserRole(
            req.params.userId,
            req.params.roleId
        );

        res.json(response);

    } catch (error) {
        next(error);
    }
};