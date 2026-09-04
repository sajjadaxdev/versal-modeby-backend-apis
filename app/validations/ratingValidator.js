import Joi from "joi";

export const validateCreateRating = Joi.object({

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            "number.base": "Rating must be a number",
            "number.integer": "Rating must be a whole number",
            "number.min": "Rating must be at least 1",
            "number.max": "Rating must not exceed 5",
            "any.required": "Rating is required",
        }),

    comment: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .messages({
            "string.max": "Comment must not exceed 500 characters",
        }),

});