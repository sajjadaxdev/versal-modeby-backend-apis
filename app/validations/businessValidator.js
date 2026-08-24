import Joi from "joi";

export const validateCreateBusines = Joi.object({

    name: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Business name is required",
            "any.required": "Business name is required",
            "string.max": "Business name must not exceed 255 characters",
        }),

    email: Joi.string()
        .trim()
        .email()
        .allow("", null)
        .messages({
            "string.email": "Please enter a valid email address",
        }),

    phone: Joi.string()
        .trim()
        .max(30)
        .allow("", null)
        .messages({
            "string.max": "Phone must not exceed 30 characters",
        }),

    address: Joi.string()
        .trim()
        .max(1000)
        .allow("", null)
        .messages({
            "string.max": "Address is too long",
        }),

    logo: Joi.string()
        .trim()
        .allow("", null),

    is_active: Joi.boolean()
        .default(true),

});

export const validateUpdateBusines = Joi.object({

    name: Joi.string()
        .trim()
        .max(255)
        .required()
        .messages({
            "string.empty": "Business name is required",
            "any.required": "Business name is required",
            "string.max": "Business name must not exceed 255 characters",
        }),

    email: Joi.string()
        .trim()
        .email()
        .allow("", null)
        .messages({
            "string.email": "Please enter a valid email address",
        }),

    phone: Joi.string()
        .trim()
        .max(30)
        .allow("", null)
        .messages({
            "string.max": "Phone must not exceed 30 characters",
        }),

    address: Joi.string()
        .trim()
        .max(1000)
        .allow("", null)
        .messages({
            "string.max": "Address is too long",
        }),

    logo: Joi.string()
        .trim()
        .allow("", null),

    is_active: Joi.boolean(),

});