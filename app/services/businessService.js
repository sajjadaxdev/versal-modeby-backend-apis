import slugify from "slugify";

import * as businessRepository from "../repositories/businessRepository.js";
import { AppError } from "../utils/AppError.js";
import { replaceFile, deleteFile } from "../helpers/fileHelper.js";
import {
    transformBusiness,
    transformBusinesses,
} from "../transformers/businessTransformer.js";
/*
|--------------------------------------------------------------------------
| Get Businesses
|--------------------------------------------------------------------------
*/

export const getBusinesses = async (filters) => {

    const result = await businessRepository.findAll(filters);

    return {
        success: true,
        message: "Businesses fetched successfully",
        data: transformBusinesses(result.rows),
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / result.limit),
        },
    }
};

/*
|--------------------------------------------------------------------------
| Get Business By Id
|--------------------------------------------------------------------------
*/

export const getBusinessById = async (id) => {

    const business = await businessRepository.findById(id);

    if (!business) {
        throw new AppError("Business not found.", 404);
    }

    return {
        success: true,
        message: "Businesses fetched successfully",
        data: transformBusiness(business)
    }

};

/*
|--------------------------------------------------------------------------
| Create Business
|--------------------------------------------------------------------------
*/


export const createBusiness = async (data, file) => {

    const existsByName = await businessRepository.findByName(
        data.name
    );

    if (existsByName) {
        throw new AppError("Business name already exists.", 400);
    }

    data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    if (file)
        data.logo = `business/${file.filename}`;

    const business = await businessRepository.create(data);

    return {
        success: true,
        message: "Business created successfully",
        data: business,
    };

};


/*
|--------------------------------------------------------------------------
| Update Business
|--------------------------------------------------------------------------
*/


export const updateBusiness = async (id, data, file ) => {

    const business = await businessRepository.findById(id);

    if (!business) {
        throw new AppError("Business not found.", 404);
    }

    const existsByName = await businessRepository.findByName(data.name);
    
    if (existsByName && existsByName.id != id) {
        throw new AppError("Business name already exists", 409);
    }

    data.slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });



    if (file)
        data.logo = replaceFile("business", business.logo, file.filename);

    const updatedBusiness = await businessRepository.update(
        id,
        data
    );

    return {
        success: true,
        message: "Business updated successfully",
        data: updatedBusiness,
    };

};
 
/*
|--------------------------------------------------------------------------
| Delete Business
|--------------------------------------------------------------------------
*/

export const deleteBusiness = async (id) => {

    const business = await businessRepository.findById(id);

    if (!business) {

        throw new AppError("Business not found.", 404);

    }

    deleteFile("business", business.logo);
    await businessRepository.remove(id);

    return {
        success: true,
        message: "Business deleted successfully",
    };

};