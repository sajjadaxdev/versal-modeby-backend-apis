import Joi from "joi";

export const createValidator = Joi.object({
    city_id: Joi.number().integer().positive().required(),
    vehicle_type_id: Joi.number().integer().positive().required(),
    base_fare: Joi.number().min(0).required(),
    per_km_rate: Joi.number().min(0).required(),
    per_min_rate: Joi.number().min(0).required(),
    minimum_fare: Joi.number().min(0).required(),
    is_active: Joi.boolean().optional().default(true).messages({
        "boolean.base": "Is Active must be true or false.",
    }),
});

export const updateValidator = Joi.object({
    city_id: Joi.number().integer().positive().required(),
    vehicle_type_id: Joi.number().integer().positive().required(),
    base_fare: Joi.number().min(0).required(),
    per_km_rate: Joi.number().min(0).required(),
    per_min_rate: Joi.number().min(0).required(),
    minimum_fare: Joi.number().min(0).required(),
    is_active: Joi.boolean().optional().messages({
        "boolean.base": "Is Active must be true or false.",
    }),
});

export const updateStatusValidator = Joi.object({
    is_active: Joi.boolean().optional().messages({
        "boolean.base": "Is Active must be true or false.",
    }),
});