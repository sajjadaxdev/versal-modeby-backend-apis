import * as roleService from "../services/roleService.js";

export const getRoles = async (req, res, next) => {

    try {

        const response = await roleService.getRoles(req.query);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

export const getRole = async (req, res, next) => {

    try {

        const response = await roleService.getRole(req.params.id);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

export const createRole = async (req, res, next) => {

    try {

        const response = await roleService.createRole(req.body);

        res.status(201).json(response);

    } catch (error) {

        next(error);

    }

};

export const updateRole = async (req, res, next) => {

    try {

        const response = await roleService.updateRole(
            req.params.id,
            req.body
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const deleteRole = async (req, res, next) => {

    try {

        const response = await roleService.deleteRole(req.params.id);
        res.json(response);


    } catch (error) {
        next(error);
    }

};