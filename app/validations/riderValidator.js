import Joi from "joi";

export const createRiderValidator = Joi.object({

    user_id: Joi.number().integer().required().messages({
        "any.required": "User ID is required.",
        "number.base": "User ID must be a number.",
    }),
    preferred_payment: Joi.string().valid("wallet", "card", "cash").default("wallet").messages({
        "any.only": "Preferred payment must be wallet, card or cash."
    })

});

export const updateRiderValidator = Joi.object({

    user_id: Joi.number().integer().required().messages({
        "any.required": "User ID is required.",
        "number.base": "User ID must be a number.",
    }),

    preferred_payment: Joi.string().valid("wallet", "card", "cash").required().messages({
        "any.required": "Preferred payment is required.",
        "any.only": "Preferred payment must be wallet, card or cash."
    })

});