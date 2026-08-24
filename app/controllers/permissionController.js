import * as permissionService from "../services/permissionService.js";

export const getPermissions = async (req, res, next) => {

    try {

        const response = await permissionService.getPermissions(req.query);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

export const getPermission = async (req, res, next) => {

    try {

        const response = await permissionService.getPermission(req.params.id);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

export const createPermission = async (req, res, next) => {

    try {

        const response = await permissionService.createPermission(req.body);

        res.status(201).json(response);

    } catch (error) {

        next(error);

    }

};

export const updatePermission = async (req, res, next) => {

    try {

        const response = await permissionService.updatePermission(
            req.params.id,
            req.body
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const deletePermission = async (req, res, next) => {

    try {

        const response = await permissionService.deletePermission(req.params.id);
        res.json(response);


    } catch (error) {
        next(error);
    }

};