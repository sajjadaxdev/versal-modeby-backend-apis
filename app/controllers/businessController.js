import * as businessService from "../services/businessService.js";

export const index = async (req, res, next) => {

    try {

        const result = await businessService.getBusinesses(req.query);

        return res.json(result);

    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Get Business By Id
|--------------------------------------------------------------------------
*/

export const show = async (req, res, next) => {

    try {

        const response = await businessService.getBusinessById(
            req.params.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Create Business
|--------------------------------------------------------------------------
*/

export const store = async (req, res, next) => {

    try {

        const response = await businessService.createBusiness(
            req.body,
            req.file
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Update Business
|--------------------------------------------------------------------------
*/

export const update = async (req, res, next) => {

    try {

        const response = await businessService.updateBusiness(
            req.params.id,
            req.body,
            req.file
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Delete Business
|--------------------------------------------------------------------------
*/

export const destroy = async (req, res, next) => {

    try {

        const response = await businessService.deleteBusiness(req.params.id);

        return res.json(response);

    } catch (error) {

        next(error);

    }

};