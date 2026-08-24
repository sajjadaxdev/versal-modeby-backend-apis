import * as filterService from "../services/filterService.js";

/*
|--------------------------------------------------------------------------
| Vehicle Types Filter
|--------------------------------------------------------------------------
*/

export const vehicleTypes = async (req, res, next) => {
    try {

        const response = await filterService.getVehicleTypes();

        return res.json(response);

    } catch (error) {

        next(error);

    }
};

/*
|--------------------------------------------------------------------------
| Vehicle Owner Filters
|--------------------------------------------------------------------------
*/

export const vehicleOwners = async (req, res, next) => {

    try {

        const result = await filterService.getVehicleOwners();

        res.json(result);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| Cities Filters
|--------------------------------------------------------------------------
*/

export const cities = async (req, res, next) => {

    try {

        const result = await filterService.getCities();

        res.json(result);

    } catch (error) {

        next(error);

    }

};