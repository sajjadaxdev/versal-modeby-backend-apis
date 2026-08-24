import * as vehicleRepository from "../repositories/vehicleRepository.js";
import * as vehicleOwnerRepository from "../repositories/vehicleOwnersRepository.js";
import knex from "../../db/knex.js";

import { AppError } from "../utils/AppError.js";
import { replaceFile, deleteFile } from "../helpers/fileHelper.js";
import { transformVehicle, transformVehicles } from "../transformers/vehicleTransformer.js";
/*
|--------------------------------------------------------------------------
| Get Vehicles
|--------------------------------------------------------------------------
*/

export const getVehicles = async (filters) => {

    const result = await vehicleRepository.findAll(filters);

    return {
        success: true,
        message: "Vehicles fetched successfully.",
        data: transformVehicles(result.rows),
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
| Get Vehicle By Id
|--------------------------------------------------------------------------
*/

export const getVehicleById = async (id) => {

    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
        throw new AppError("Vehicle not found.", 404);
    }

    return {
        success: true,
        message: "Vehicle fetched successfully.",
        data: transformVehicle(vehicle),
    };

};

/*
|--------------------------------------------------------------------------
| Create Vehicle
|--------------------------------------------------------------------------
*/

export const createVehicle = async (data, file) => {

    const exists = await vehicleRepository.findByRegistrationNumber(
        data.registration_number
    );

    if (exists) {
        throw new AppError("Registration number already exists.", 400);
    }

    if (file) {
        data.vehicle_image = `vehicles/${file.filename}`;
    }

    const vehicle =  await knex.transaction(async (trx) => {

        const vehicle = await vehicleRepository.create({
            vehicle_type_id: data.vehicle_type_id,
            make: data.make,
            model: data.model,
            year: data.year,
            color: data.color,
            registration_number: data.registration_number,
            vehicle_image: data.vehicle_image,
            allow_city_ride: data.allow_city_ride,
            allow_intercity_ride: data.allow_intercity_ride,
            is_verified: data.is_verified,
            is_active: data.is_active,
        }, trx);

        await vehicleOwnerRepository.create({
            vehicle_id: vehicle.id,
            owner_type: data.owner_type,
            owner_id: data.owner_id,
            ownership_percentage: 100,
        }, trx);

        return vehicle;

    });

    return {
        success: true,
        message: "Vehicle created successfully.",
        data: vehicle,
    };

};

/*
|--------------------------------------------------------------------------
| Update Vehicle
|--------------------------------------------------------------------------
*/

export const updateVehicle = async (id, data, file) => {

    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
        throw new AppError("Vehicle not found.", 404);
    }

    const exists = await vehicleRepository.findByRegistrationNumber(
        data.registration_number
    );

    if (exists && Number(exists.id) !== Number(id)) {
        throw new AppError(
            "Registration number already exists.",
            409
        );
    }

    if (file) {
        data.vehicle_image = replaceFile(
            "vehicles",
            vehicle.vehicle_image,
            file.filename
        );
    }

    const updatedVehicle = await knex.transaction(async (trx) => {

        const vehicleRecord = await vehicleRepository.update(
            id,
            {
                vehicle_type_id: data.vehicle_type_id,
                make: data.make,
                model: data.model,
                year: data.year,
                color: data.color,
                registration_number: data.registration_number,
                vehicle_image: data.vehicle_image,
                allow_city_ride: data.allow_city_ride,
                allow_intercity_ride: data.allow_intercity_ride,
                is_verified: data.is_verified,
                is_active: data.is_active,
            },
            trx
        );

        // Single owner only
        await vehicleOwnerRepository.deleteByVehicleId(
            id,
            trx
        );

        await vehicleOwnerRepository.create({
            vehicle_id: id,
            owner_type: data.owner_type,
            owner_id: data.owner_id,
            ownership_percentage: 100,
        }, trx);

        return vehicleRecord;
    });

    return {
        success: true,
        message: "Vehicle updated successfully.",
        data: updatedVehicle,
    };

};


/*
|--------------------------------------------------------------------------
| Delete Vehicle
|--------------------------------------------------------------------------
*/

export const deleteVehicle = async (id) => {

    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
        throw new AppError("Vehicle not found.", 404);
    }

    if (vehicle.vehicle_image) {
        deleteFile(vehicle.vehicle_image);
    }

    await vehicleRepository.remove(id);

    return {
        success: true,
        message: "Vehicle deleted successfully.",
    };

};

/*
|--------------------------------------------------------------------------
| Assign Driver To Vehicle
|--------------------------------------------------------------------------
*/

export const assignDriverToVehicle = async (vehicleId, driverId) => {

    const vehicle = await vehicleRepository.findById(vehicleId);

    if (!vehicle) {
        throw new AppError("Vehicle not found.", 404);
    }

    const updatedVehicle = await vehicleRepository.assignDriver(
        vehicleId,
        driverId
    );

    return {
        success: true,
        message: driverId ? "Driver assigned successfully." : "Driver unassigned successfully.",
        data: updatedVehicle,
    };

};