import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Create Franchise Validation
|--------------------------------------------------------------------------
*/

export const validateCreateFranchise = Joi.object({

    name: Joi.string().trim().max(255).required().messages({
        "string.empty": "Franchise name is required.",
        "any.required": "Franchise name is required.",
        "string.max": "Franchise name must not exceed 255 characters.",
    }),
    
    address: Joi.string().trim().allow("", null).max(1000).messages({
        "string.max": "Address must not exceed 1000 characters.",
    }),
    ownership_type: Joi.string().valid("company", "franchise").required().messages({
        "any.required": "Ownership type is required.",
        "any.only": "Ownership type must be either company or franchise.",
    }),

    is_head_office: Joi.boolean().default(false).messages({
        "boolean.base": "Head office must be true or false.",
    }),

    is_active: Joi.boolean().default(true),

});

/*
|--------------------------------------------------------------------------
| Update Franchise Validation
|--------------------------------------------------------------------------
*/

export const validateUpdateFranchise = Joi.object({
    
    name: Joi.string().trim().max(255).required().messages({
        "string.empty": "Franchise name is required.",
        "any.required": "Franchise name is required.",
        "string.max": "Franchise name must not exceed 255 characters.",
    }),

    address: Joi.string().trim().allow("", null).max(1000).messages({
        "string.max": "Address must not exceed 1000 characters.",
    }),
    
    ownership_type: Joi.string().valid("company", "franchise").required().messages({
        "any.required": "Ownership type is required.",
        "any.only": "Ownership type must be either company or franchise.",
    }),

    is_head_office: Joi.boolean().messages({
        "boolean.base": "Head office must be true or false.",
    }),

    is_active: Joi.boolean().messages({
        "boolean.base": "Status must be true or false.",
    }),

});