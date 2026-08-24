import * as filterRepository from "../repositories/filterRepository.js";

/*
|--------------------------------------------------------------------------
| Vehicle Types Filter
|--------------------------------------------------------------------------
*/

export const getVehicleTypes = async () => {

    const vehicleTypes = await filterRepository.getVehicleTypes();

    return {
        success: true,
        message: "Vehicle types fetched successfully.",
        data: vehicleTypes,
    };

};

/*
|--------------------------------------------------------------------------
| Vehicle Owner Filters
|--------------------------------------------------------------------------
*/

export const getVehicleOwners = async () => {

    const data = await filterRepository.getVehicleOwners();

    return {
        success: true,
        message: "Vehicle owner filters fetched successfully.",
        data,
    };

};

/*
|--------------------------------------------------------------------------
| Cities Filters
|--------------------------------------------------------------------------
*/

export const getCities = async () => {

    const data = await filterRepository.getCities();

    return {
        success: true,
        message: "Cities filters fetched successfully.",
        data,
    };

};