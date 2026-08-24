import Joi from "joi";

export const validateSyncRolePermissions = Joi.object({

    permissions: Joi.array()
        .items(
            Joi.number()
                .integer()
                .positive()
        )
        .required()
        .messages({
            "array.base": "Permissions must be an array",
            "any.required": "Permissions are required",
        }),

});