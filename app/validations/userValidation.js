import Joi from "joi";

export const validateUserRegister = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
        "string.empty": "User Name is required",
        "string.min": "User Name must be at least 3 characters long",
        "string.max": "User Name length must be less than or equal to 50 characters long",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
});

export const validateUserLogin = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "User Name is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
    }),
});

export const validateSendOTP = Joi.object({
    phone: Joi.string()
    .pattern(/^0\d{9}$/) // 10 digits starting with 0
    .required()
    .messages({
      "string.empty": "Phone No is required",
      "any.required": "Phone No is required",
      "string.pattern.base":
        "Phone number must be 10 digits",
    }),
    fcmToken: Joi.string().allow("", null).optional(),
});

export const validateVerifyOTP = Joi.object({
    phone: Joi.string()
    .pattern(/^0\d{9}$/) // 10 digits starting with 0
    .required()
    .messages({
      "string.empty": "Phone No is required",
      "any.required": "Phone No is required",
      "string.pattern.base":
        "Phone number must be 10 digits",
    }),
    otp: Joi.string().required().messages({
      "string.empty": "OTP is required",
    }),
});

export const validateUpdateUsername = Joi.object({
    userId: Joi.required()
    .messages({
      "string.empty": "Missing data user id No is required",
    }),
    name: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
});


export const validateGoogleLogin = Joi.object({
    idToken: Joi.string().required()
    .messages({
      "string.empty": "Missing data google tokenId",
    }),
    fcmToken: Joi.string().allow("", null).optional(),
});

export const validateUpdateFCM = Joi.object({
    fcm_token: Joi.string()
        .trim()
        .required()
        .messages({
            "any.required": "Missing data fcm_token",
            "string.empty": "fcm_token id required",
        }),
});
