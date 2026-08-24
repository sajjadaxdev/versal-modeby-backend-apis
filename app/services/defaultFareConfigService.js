import * as defaultFareConfigRepository from "../repositories/defaultFareConfigRepository.js";
import {AppError} from "../utils/AppError.js";
import {
    transformDefaultFareConfig,
    transformDefaultFareConfigs,
} from "../transformers/defaultFareConfigTransformer.js";
/*
|--------------------------------------------------------------------------
| List
|--------------------------------------------------------------------------
*/

export const getAll = async (filters) => {

    const result = await defaultFareConfigRepository.findAll(filters);

    return {
        success: true,
        message: "Default fare configurations fetched successfully.",
        data: transformDefaultFareConfigs(result.rows),
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

    const fareConfig = await defaultFareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Default fare configuration not found.", 404);
    }
    
    return {
        success: true,
        message: "Default fare configuration fetched successfully",
        data: transformDefaultFareConfig(fareConfig),
    };

};

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

export const create = async (data) => {

    const exists = await defaultFareConfigRepository.findDuplicate(
        data.vehicle_type_id
    );

    if (exists) {
        throw new AppError(
            "Default fare configuration already exists for this vehicle type."
        , 400);
    }

    const fareConfig = await defaultFareConfigRepository.create(data);
    
    return {
        success: true,
        message: "Default fare configuration created successfully.",
        data: fareConfig,
    };

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const update = async (id, data) => {

    const fareConfig = await defaultFareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Default fare configuration not found.", 404);
    }

     if (data.city_id && data.vehicle_type_id) { 
        const exists = await defaultFareConfigRepository.findDuplicate(
            data.vehicle_type_id,
            id
        );
     
        if (exists)
            throw new AppError("Default fare configuration already exists for this vehicle type." , 400);
    }

    const updatedFareConfig = await defaultFareConfigRepository.update(id, data);

    return {
        success: true,
        message: "Default fare configuration updated successfully.",
        data: updatedFareConfig,
    };

};

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateStatus = async (id, data) => {

    const fareConfig = await defaultFareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new AppError("Default fare configuration not found.", 404);
    }

    await defaultFareConfigRepository.updateStatus(id, data);

    return {
        success: true,
        message: "Default fare configuration status updated successfully.",
    };

};

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const remove = async (id) => {

    const fareConfig = await defaultFareConfigRepository.findById(id);

    if (!fareConfig) {
        throw new Error("Default fare configuration not found.");
    }

    await defaultFareConfigRepository.remove(id);

    
    return {
        success: true,
        message: "Default fare configuration deleted successfully.",
    };

};