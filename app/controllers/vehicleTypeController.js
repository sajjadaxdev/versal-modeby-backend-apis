import * as vehicleTypeService from "../services/vehicleTypeService.js";

/*
|--------------------------------------------------------------------------
| Get Vehicle Types
|--------------------------------------------------------------------------
*/

export const index = async (req, res, next) => {

    try {

        const response = await vehicleTypeService.getVehicleTypes(req.query);

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Get Vehicle Type By Id
|--------------------------------------------------------------------------
*/

export const show = async (req, res, next) => {

    try {

        const response = await vehicleTypeService.getVehicleTypeById(
            req.params.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Create Vehicle Type
|--------------------------------------------------------------------------
*/

export const store = async (req, res, next) => {

    try {

        const response = await vehicleTypeService.createVehicleType(
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
| Update Vehicle Type
|--------------------------------------------------------------------------
*/

export const update = async (req, res, next) => {

    try {

        const response = await vehicleTypeService.updateVehicleType(
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
| Delete Vehicle Type
|--------------------------------------------------------------------------
*/

export const destroy = async (req, res, next) => {

    try {

        const response = await vehicleTypeService.deleteVehicleType(
            req.params.id
        );

        return res.json(response);

    } catch (error) {

        next(error);

    }

};