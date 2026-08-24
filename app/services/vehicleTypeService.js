import * as vehicleTypeRepository from "../repositories/vehicleTypeRepository.js";
import { transformVehicleType, transformVehicleTypes } from "../transformers/vehicleTypeTransformer.js";
import { AppError } from "../utils/AppError.js";
import { replaceFile, deleteFile } from "../helpers/fileHelper.js";
import slugify from "slugify";
/*
|--------------------------------------------------------------------------
| Get Vehicle Types
|--------------------------------------------------------------------------
*/

export const getVehicleTypes = async (filters) => {

    const result = await vehicleTypeRepository.findAll(filters);

    return {
        success: true,
        message: "Vehicle types fetched successfully.",
        data: transformVehicleTypes(result.rows),
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
| Get Vehicle Type By Id
|--------------------------------------------------------------------------
*/

export const getVehicleTypeById = async (id) => {

    const vehicleType = await vehicleTypeRepository.findById(id);

    if (!vehicleType) {
        throw new AppError("Vehicle type not found.", 404);
    }

    return {
        success: true,
        message: "Vehicle type fetched successfully.",
        data: transformVehicleType(vehicleType),
    };

};

/*
|--------------------------------------------------------------------------
| Create Vehicle Type
|--------------------------------------------------------------------------
*/

export const createVehicleType = async (data, file) => {

    const exists = await vehicleTypeRepository.findByName(data.name);

    if (exists) {
        throw new AppError("Vehicle type already exists.", 400);
    }

    if (file) {
        data.icon = `vehicleTypes/${file.filename}`;
    }

    data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const vehicleType = await vehicleTypeRepository.create(data);

    return {
        success: true,
        message: "Vehicle type created successfully.",
        data: vehicleType,
    };

};

/*
|--------------------------------------------------------------------------
| Update Vehicle Type
|--------------------------------------------------------------------------
*/

export const updateVehicleType = async (id, data, file) => {

    const vehicleType = await vehicleTypeRepository.findById(id);

    if (!vehicleType) {
        throw new AppError("Vehicle type not found.", 404);
    }

    const exists = await vehicleTypeRepository.findByName(data.name);

    if (exists && Number(exists.id) !== Number(id)) {
        throw new AppError("Vehicle type already exists.", 409);
    }

    if (file) {
        data.icon = replaceFile(
            "vehicleTypes",
            vehicleType.icon,
            file.filename
        );
    }

    data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const updatedVehicleType = await vehicleTypeRepository.update(id, data);

    return {
        success: true,
        message: "Vehicle type updated successfully.",
        data: updatedVehicleType,
    };

};

/*
|--------------------------------------------------------------------------
| Delete Vehicle Type
|--------------------------------------------------------------------------
*/

export const deleteVehicleType = async (id) => {

    const vehicleType = await vehicleTypeRepository.findById(id);

    if (!vehicleType) {
        throw new AppError("Vehicle type not found.", 404);
    }

    if (vehicleType.icon) {
        deleteFile(vehicleType.icon);
    }

    await vehicleTypeRepository.remove(id);

    return {
        success: true,
        message: "Vehicle type deleted successfully.",
    };

};