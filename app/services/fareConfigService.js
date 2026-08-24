import * as fareConfigRepository from "../repositories/fareConfigRepository.js";
import {AppError} from "../utils/AppError.js";
import {
    transformFareConfig,
    transformFareConfigs,
} from "../transformers/fareConfigTransformer.js";
/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export const getAll = async (filters) => {

    const result = await fareConfigRepository.findAll(filters);

    return {
        success: true,
        message: "Fare configurations fetched successfully.",
        data: transformFareConfigs(result.rows),
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    };

};

/*
|--------------------------------------------------------------------------
| Detail
|--------------------------------------------------------------------------
*/

export const getById = async (id) => {

    const fareConfig = await fareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Fare configuration not found.", 404);
    }
    
    return {
        success: true,
        message: "Fare configuration fetched successfully",
        data: transformFareConfig(fareConfig),
    };

};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const exists = await fareConfigRepository.findDuplicate(
        data.city_id,
        data.vehicle_type_id
    );

    if (exists) {
        throw new AppError(
            "Fare configuration already exists for this city and vehicle type."
        , 400);
    }

    const fareConfig = await fareConfigRepository.create(data);
    
    return {
        success: true,
        message: "Fare configuration created successfully.",
        data: fareConfig,
    };

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const fareConfig = await fareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Fare configuration not found.", 404);
    }

     if (data.city_id && data.vehicle_type_id) { 
        const exists = await fareConfigRepository.findDuplicate(
            data.city_id,
            data.vehicle_type_id,
            id
        );
     
        if (exists)
            throw new AppError("Fare configuration already exists for this city and vehicle type." , 400);
    }

    const updatedFareConfig = await fareConfigRepository.update(id, data);

    return {
        success: true,
        message: "Fare configuration updated successfully.",
        data: updatedFareConfig,
    };

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateStatus = async (id, data) => {

    const fareConfig = await fareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Fare configuration not found.", 404);
    }

    await fareConfigRepository.updateStatus(id, data);

    return {
        success: true,
        message: "Fare configuration status updated successfully.",
    };

};

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    const fareConfig = await fareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new Error("Fare configuration not found.");
    }

    await fareConfigRepository.remove(id);

    
    return {
        success: true,
        message: "Fare configuration deleted successfully.",
    };

};