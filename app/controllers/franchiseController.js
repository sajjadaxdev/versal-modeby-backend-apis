import * as franchiseService from "../services/franchiseService.js";

export const getFranchises = async (req, res, next) => {

    try {

        const response = await franchiseService.getFranchises(req.query);

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const getFranchise = async (req, res, next) => {

    try {

        const response = await franchiseService.getFranchise(
            req.params.id
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const createFranchise = async (req, res, next) => {

    try {

        const response = await franchiseService.createFranchise(
            req.body
        );

        res.status(201).json(response);

    } catch (error) {

        next(error);

    }

};

export const updateFranchise = async (req, res, next) => {

    try {

        const response = await franchiseService.updateFranchise(
            req.params.id,
            req.body
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};

export const deleteFranchise = async (req, res, next) => {

    try {

        const response = await franchiseService.deleteFranchise(
            req.params.id
        );

        res.json(response);

    } catch (error) {

        next(error);

    }

};