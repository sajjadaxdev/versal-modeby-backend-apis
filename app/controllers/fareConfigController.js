import * as fareConfigService from "../services/fareConfigService.js";

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export const index = async (req, res, next) => {

    try {

        const response = await fareConfigService.getAll(req.query);

        res.json(response);
    
    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

export const show = async (req, res, next) => {

    try {

        const response = await fareConfigService.getById(req.params.id);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const store = async (req, res, next) => {

    try {

        const response = await fareConfigService.create(req.body);

        res.json(response);

    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (req, res, next) => {

    try {

        const response = await fareConfigService.update(
            req.params.id,
            req.body
        );

        res.json(response);

    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateStatus = async (req, res, next) => {

    try {

        const response = await fareConfigService.updateStatus(
            req.params.id,
            req.body
        );

        res.json(response);

    } catch (error) {
        next(error);
    }

};

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const destroy = async (req, res, next) => {

    try {

        const response = await fareConfigService.remove(req.params.id);

        res.json(response);

    } catch (error) {
        next(error);
    }

};