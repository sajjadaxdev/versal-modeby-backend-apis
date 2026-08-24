import Joi from "joi";

export const validateDriverOnlineStatus = Joi.object({
    is_online: Joi.boolean()
        .required()
        .messages({
            "any.required": "is_online is required.",
            "boolean.base": "is_online must be a boolean value.",
        }),
});

export const registerDriverValidator = Joi.object({

    user_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "User id is required.",
            "number.base": "User id must be a number.",
        }),

    vehicle_type_id: Joi.number()
    .required()
    .messages({
        "any.required":"Vehicle type is required.",
        "number.base":"Vehicle type must be a number."
    })
});

export const updateBasicInfoValidator = Joi.object({

    user_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "User ID is required.",
            "number.base": "User ID must be a number.",
        }),

    first_name: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "any.required": "First name is required.",
            "string.empty": "First name is required.",
        }),

    last_name: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "any.required": "Last name is required.",
            "string.empty": "Last name is required.",
        }),

    dob: Joi.date()
        .required()
        .messages({
            "any.required": "Date of birth is required.",
        }),

});

export const updateIdentityValidator = Joi.object({

    user_id: Joi.number().required().messages({
        "any.required": "User id is required."
    }),

});

export const updateLicenseValidator = Joi.object({

    user_id: Joi.number()
        .required()
        .messages({
            "any.required": "User id is required.",
            "number.base": "User id must be a number."
        }),

    license_number: Joi.string()
        .trim()
        .required()
        .messages({
            "any.required": "License number is required.",
            "string.empty": "License number is required."
        }),

    license_expiration_date: Joi.date()
        .required()
        .messages({
            "any.required": "License expiration date is required.",
            "date.base": "License expiration date is invalid."
        }),

});

export const submitDriverValidator = Joi.object({

    user_id: Joi.number()
        .required()
        .messages({
            "any.required": "User id is required.",
            "number.base": "User id must be a number."
        }),

});

export const updateVehicleValidator = Joi.object({

    user_id: Joi.number()
        .integer()
        .required()
        .messages({
            "any.required": "User ID is required.",
            "number.base": "User ID must be a number.",
        }),

    // vehicle_type_id: Joi.number()
    //     .integer()
    //     .required()
    //     .messages({
    //         "any.required": "Vehicle type is required.",
    //     }),

    make: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "any.required": "Vehicle make is required.",
        }),

    model: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "any.required": "Vehicle model is required.",
        }),

    year: Joi.number()
        .integer()
        .min(1980)
        .max(new Date().getFullYear() + 1)
        .required()
        .messages({
            "any.required": "Vehicle year is required.",
        }),

    color: Joi.string()
        .trim()
        .max(50)
        .required()
        .messages({
            "any.required": "Vehicle color is required.",
        }),

    registration_number: Joi.string()
        .trim()
        .max(100)
        .required()
        .messages({
            "any.required": "Registration number is required.",
        }),

    // allow_city_ride: Joi.boolean()
    //     .required(),

    // allow_intercity_ride: Joi.boolean()
    //     .required(),

});

export const validateDriverDocumentVerification = Joi.object({

    status: Joi.string()
        .valid("approved", "rejected")
        .required()
        .messages({
            "any.only": "Status must be one of: approved, rejected.",
            "any.required": "Verification status is required.",
        }),

    reason: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .when("status", { is: "rejected", then: Joi.required().messages({
                "any.required": "Rejection reason is required when rejecting a document.",
                "string.empty": "Rejection reason is required when rejecting a document.",
            }),
        })
        .messages({
            "string.max":"Reason must not exceed 500 characters.",
        }),

});

export const validateDriverLocation = Joi.object({
    
    latitude: Joi.number().min(-90).max(90).required().messages({
        "any.required": "latitude is required.",
        "number.base": "latitude must be a number.",
        "number.min": "latitude must be greater than or equal to -90.",
        "number.max": "latitude must be less than or equal to 90.",
    }),

    longitude: Joi.number().min(-180).max(180).required().messages({
        "any.required": "longitude is required.",
        "number.base": "longitude must be a number.",
        "number.min": "longitude must be greater than or equal to -180.",
        "number.max": "longitude must be less than or equal to 180.",
    }),

    heading: Joi.number().min(0).max(360).allow(null).messages({
        "number.base": "heading must be a number.",
        "number.min": "heading must be greater than or equal to 0.",
        "number.max": "heading must be less than or equal to 360.",
    }),

    speed: Joi.number().min(0).allow(null).messages({
        "number.base": "speed must be a number.",
        "number.min": "speed must be greater than or equal to 0.",
    }),
});