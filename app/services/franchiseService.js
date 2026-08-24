import * as franchiseRepository from "../repositories/franchiseRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { AppError } from "../utils/AppError.js";
import {
    transformFranchise,
    transformFranchises,
} from "../transformers/franchiseTransformer.js";

/*
|--------------------------------------------------------------------------
| Get Franchises
|--------------------------------------------------------------------------
*/

export const getFranchises = async (filters) => {

    const result = await franchiseRepository.findAll(filters);

    return {
        success: true,
        message: "Franchises fetched successfully",
        data: transformFranchises(result.rows),
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
| Get Franchise
|--------------------------------------------------------------------------
*/

export const getFranchise = async (id) => {

    const franchise = await franchiseRepository.findById(id);

    if (!franchise) {
        throw new AppError("Franchise not found.", 404);
    }

    return {
        success: true,
        message: "Franchise fetched successfully",
        data: transformFranchise(franchise),
    };

};

/*
|--------------------------------------------------------------------------
| Create Franchise
|--------------------------------------------------------------------------
*/

export const createFranchise = async (data) => {

    const existsName = await franchiseRepository.findByName(
        data.name
    );

    if (existsName) {
        throw new AppError("Franchise name already exists.", 400);
    }

    const business = await businessRepository.getBusiness();

    if(!business)
        throw new AppError("Business not found.", 400);

    data.business_id = business.id;
    data.code = await franchiseRepository.getNextCode(
        business.name,
        data.name
    );
    const franchise = await franchiseRepository.create(data);

    return {
        success: true,
        message: "Franchise created successfully.",
        data: franchise,
    };

};

/*
|--------------------------------------------------------------------------
| Update Franchise
|--------------------------------------------------------------------------
*/

export const updateFranchise = async (id, data) => {

    const franchise = await franchiseRepository.findById(id);

    if (!franchise) {
        throw new AppError("Franchise not found.", 404);
    }

    const existsName = await franchiseRepository.findByName(data.name);

    if (existsName && existsName.id != id) {
        throw new AppError("Franchise name already exists in this business.", 400);
    }

    const business = await businessRepository.getBusiness();

    if(!business)
        throw new AppError("Business not found.", 400);

    data.code = await franchiseRepository.getNextCode(
        business.name,
        data.name,
        id
    );

    const updatedFranchise = await franchiseRepository.update(id, data);

    return {
        success: true,
        message: "Franchise updated successfully.",
        data: updatedFranchise,
    };

};

/*
|--------------------------------------------------------------------------
| Delete Franchise
|--------------------------------------------------------------------------
*/

export const deleteFranchise = async (id) => {

    const franchise = await franchiseRepository.findById(id);

    if (!franchise) {
        throw new AppError("Franchise not found.", 404);
    }

    await franchiseRepository.remove(id);

    return {
        success: true,
        message: "Franchise deleted successfully.",
    };

};