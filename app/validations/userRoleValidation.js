import Joi from "joi";

export const validateAssignUserRoles = Joi.object({

    roles: Joi.array()
        .items(Joi.number().integer().positive())
        .required()
        .messages({
            "array.base": "Roles must be an array.",
            "array.includes": "Invalid role id.",
            "any.required": "Roles are required.",
        }),

});