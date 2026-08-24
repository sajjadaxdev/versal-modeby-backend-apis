import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Create Vehicle Validation
|--------------------------------------------------------------------------
*/

export const validateCreateVehicle = Joi.object({

    driver_id: Joi.number().integer().positive().allow(null, "").optional().messages({
        "number.base": "Driver is invalid.",
        "number.integer": "Driver is invalid.",
    }),

    vehicle_type_id: Joi.number().integer().positive().required().messages({
        "any.required": "Vehicle type is required.",
        "number.base": "Vehicle type is invalid.",
        "number.integer": "Vehicle type is invalid.",
    }),

    make: Joi.string().trim().max(100).required().messages({
        "string.empty": "Vehicle make is required.",
        "any.required": "Vehicle make is required.",
        "string.max": "Vehicle make must not exceed 100 characters.",
    }),

    model: Joi.string().trim().max(100).required().messages({
        "string.empty": "Vehicle model is required.",
        "any.required": "Vehicle model is required.",
        "string.max": "Vehicle model must not exceed 100 characters.",
    }),

    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required().messages({
        "any.required": "Vehicle year is required.",
        "number.base": "Vehicle year must be a number.",
        "number.integer": "Vehicle year must be an integer.",
        "number.min": "Vehicle year is invalid.",
        "number.max": "Vehicle year is invalid.",
    }),

    color: Joi.string().trim().max(50).required().messages({
        "string.empty": "Vehicle color is required.",
        "any.required": "Vehicle color is required.",
        "string.max": "Vehicle color must not exceed 50 characters.",
    }),

    registration_number: Joi.string().trim().max(50).required().messages({
        "string.empty": "Registration number is required.",
        "any.required": "Registration number is required.",
        "string.max": "Registration number must not exceed 50 characters.",
    }),

    vehicle_image: Joi.string().trim().allow("", null).max(500).messages({
        "string.max": "Vehicle image path must not exceed 500 characters.",
    }),

    owner_type: Joi.string().valid("business", "franchise", "driver", "partner").required().messages({
        "any.required": "Owner type is required.",
        "any.only": "Owner type is invalid.",
        "string.empty": "Owner type is required.",
    }),

    owner_id: Joi.number().integer().positive().required().messages({
        "any.required": "Owner is required.",
        "number.base": "Owner is invalid.",
        "number.integer": "Owner is invalid.",
    }),

    is_verified: Joi.boolean().default(false).messages({
        "boolean.base": "Verification status must be true or false.",
    }),

    allow_city_ride: Joi.boolean().default(true).messages({
        "boolean.base": "Allow city ride must be true or false.",
    }),

    allow_intercity_ride: Joi.boolean().default(false).messages({
        "boolean.base": "Allow InterCity ride must be true or false.",
    }),

    is_active: Joi.boolean().default(true).messages({
        "boolean.base": "Status must be true or false.",
    }),


});


/*
|--------------------------------------------------------------------------
| Update Vehicle Validation
|--------------------------------------------------------------------------
*/

export const validateUpdateVehicle = Joi.object({

    driver_id: Joi.number().integer().positive().allow(null, "").optional().messages({
        "number.base": "Driver is invalid.",
        "number.integer": "Driver is invalid.",
    }),

    vehicle_type_id: Joi.number().integer().positive().required().messages({
        "any.required": "Vehicle type is required.",
        "number.base": "Vehicle type is invalid.",
        "number.integer": "Vehicle type is invalid.",
    }),

    make: Joi.string().trim().max(100).required().messages({
        "string.empty": "Vehicle make is required.",
        "any.required": "Vehicle make is required.",
        "string.max": "Vehicle make must not exceed 100 characters.",
    }),

    model: Joi.string().trim().max(100).required().messages({
        "string.empty": "Vehicle model is required.",
        "any.required": "Vehicle model is required.",
        "string.max": "Vehicle model must not exceed 100 characters.",
    }),

    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required().messages({
        "any.required": "Vehicle year is required.",
        "number.base": "Vehicle year must be a number.",
        "number.integer": "Vehicle year must be an integer.",
        "number.min": "Vehicle year is invalid.",
        "number.max": "Vehicle year is invalid.",
    }),

    color: Joi.string().trim().max(50).required().messages({
        "string.empty": "Vehicle color is required.",
        "any.required": "Vehicle color is required.",
        "string.max": "Vehicle color must not exceed 50 characters.",
    }),

    registration_number: Joi.string().trim().max(50).required().messages({
        "string.empty": "Registration number is required.",
        "any.required": "Registration number is required.",
        "string.max": "Registration number must not exceed 50 characters.",
    }),

    vehicle_image: Joi.string().trim().allow("", null).max(500).messages({
        "string.max": "Vehicle image path must not exceed 500 characters.",
    }),


    owner_type: Joi.string().valid("business", "franchise", "driver", "partner").required().messages({
        "any.required": "Owner type is required.",
        "any.only": "Owner type is invalid.",
        "string.empty": "Owner type is required.",
    }),

    owner_id: Joi.number().integer().positive().required().messages({
        "any.required": "Owner is required.",
        "number.base": "Owner is invalid.",
        "number.integer": "Owner is invalid.",
    }),
        
    is_verified: Joi.boolean().messages({
        "boolean.base": "Verification status must be true or false.",
    }),

    allow_city_ride: Joi.boolean().messages({
        "boolean.base": "Allow city ride must be true or false.",
    }),

    allow_intercity_ride: Joi.boolean().messages({
        "boolean.base": "Allow InterCity ride must be true or false.",
    }),

    is_active: Joi.boolean().messages({
        "boolean.base": "Status must be true or false.",
    }),

});

/*
|--------------------------------------------------------------------------
| Assign Driver Validation
|--------------------------------------------------------------------------
*/

export const validateAssignDriver = Joi.object({

    driver_id: Joi.number()
        .integer()
        .positive()
        .allow(null,"")
        .required()
        .messages({
            "any.required": "Driver is required.",
            "number.base": "Driver is invalid.",
            "number.integer": "Driver is invalid.",
            "number.positive": "Driver is invalid.",
        }),

});