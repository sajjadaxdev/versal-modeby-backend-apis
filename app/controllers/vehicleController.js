import * as vehicleService from "../services/vehicleService.js";

/*
|--------------------------------------------------------------------------
| Get Vehicles
|--------------------------------------------------------------------------
*/

export const index = async (req, res, next) => {

    try {

        const response = await vehicleService.getVehicles(req.query);

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Get Vehicle By Id
|--------------------------------------------------------------------------
*/

export const show = async (req, res, next) => {

    try {

        const response = await vehicleService.getVehicleById(
            req.params.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Create Vehicle
|--------------------------------------------------------------------------
*/

export const store = async (req, res, next) => {

    try {

        const response = await vehicleService.createVehicle(
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
| Update Vehicle
|--------------------------------------------------------------------------
*/

export const update = async (req, res, next) => {

    try {

        const response = await vehicleService.updateVehicle(
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
| Delete Vehicle
|--------------------------------------------------------------------------
*/

export const destroy = async (req, res, next) => {

    try {

        const response = await vehicleService.deleteVehicle(
            req.params.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Assign Driver To Vehicle
|--------------------------------------------------------------------------
*/

export const assignDriver = async (req, res, next) => {

    try {

        const response = await vehicleService.assignDriverToVehicle(
            req.params.id,
            req.body.driver_id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};