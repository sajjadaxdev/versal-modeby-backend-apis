import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Create Vehicle Type Validation
|--------------------------------------------------------------------------
*/

export const validateCreateVehicleType = Joi.object({

    name: Joi.string().trim().max(255).required().messages({
        "string.empty": "Vehicle type name is required.",
        "any.required": "Vehicle type name is required.",
        "string.max": "Vehicle type name must not exceed 255 characters.",
    }),

    icon: Joi.string().trim().allow("", null).max(500).messages({
        "string.max": "Icon path must not exceed 500 characters.",
    }),

    seating_capacity: Joi.number().integer().min(1).max(100).required().messages({
        "any.required": "Seating capacity is required.",
        "number.base": "Seating capacity must be a number.",
        "number.integer": "Seating capacity must be an integer.",
        "number.min": "Seating capacity must be at least 1.",
        "number.max": "Seating capacity must not exceed 100.",
    }),

    display_order: Joi.number().integer().min(0).default(0).messages({
        "number.base": "Display order must be a number.",
        "number.integer": "Display order must be an integer.",
        "number.min": "Display order cannot be negative.",
    }),

    description: Joi.string().allow(null, "").optional().min(6).messages({
        "string.min": "description must be at least 6 characters long",
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
| Update Vehicle Type Validation
|--------------------------------------------------------------------------
*/

export const validateUpdateVehicleType = Joi.object({

    name: Joi.string().trim().max(255).required().messages({
        "string.empty": "Vehicle type name is required.",
        "any.required": "Vehicle type name is required.",
        "string.max": "Vehicle type name must not exceed 255 characters.",
    }),

    icon: Joi.string().trim().allow("", null).max(500).messages({
        "string.max": "Icon path must not exceed 500 characters.",
    }),
    
    seating_capacity: Joi.number().integer().min(1).max(100).required().messages({
        "any.required": "Seating capacity is required.",
        "number.base": "Seating capacity must be a number.",
        "number.integer": "Seating capacity must be an integer.",
        "number.min": "Seating capacity must be at least 1.",
        "number.max": "Seating capacity must not exceed 100.",
    }),

    display_order: Joi.number().integer().min(0).messages({
        "number.base": "Display order must be a number.",
        "number.integer": "Display order must be an integer.",
        "number.min": "Display order cannot be negative.",
    }),

    description: Joi.string().allow(null, "").optional().min(6).messages({
        "string.min": "description must be at least 6 characters long",
    }),

    
    allow_city_ride: Joi.boolean().default(true).messages({
        "boolean.base": "Allow city ride must be true or false.",
    }),

    allow_intercity_ride: Joi.boolean().default(false).messages({
        "boolean.base": "Allow InterCity ride must be true or false.",
    }),
    
    is_active: Joi.boolean().messages({
        "boolean.base": "Status must be true or false.",
    }),

});