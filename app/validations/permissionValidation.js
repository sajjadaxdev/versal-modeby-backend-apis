import Joi from "joi";

export const validateCreatePermission = Joi.object({

    name: Joi.string().required().min(3).max(50).messages({
        "string.empty": "Permission Name is required",
        "string.min": "Permission Name must be at least 3 characters long",
        "string.max": "Permission Name length must be less than or equal to 50 characters long",
    }),
    description: Joi.string().allow(null, "").optional().min(6).messages({
        "string.min": "description must be at least 6 characters long",
    }),

});

export const validateUpdatePermission = Joi.object({

    name: Joi.string().required().min(3).max(50).messages({
        "string.empty": "Permission Name is required",
        "string.min": "Permission Name must be at least 3 characters long",
        "string.max": "Permission Name length must be less than or equal to 50 characters long",
    }),
    slug: Joi.string().allow(null, "").optional(),
    description: Joi.string().allow(null, "").optional().min(6).messages({
        "string.min": "description must be at least 6 characters long",
    }),

});
