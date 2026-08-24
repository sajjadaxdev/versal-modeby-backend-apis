import Joi from "joi";

/*
|--------------------------------------------------------------------------
| Ride Options Validator
|--------------------------------------------------------------------------
*/

export const rideOptionsValidator = Joi.object({

    pickup_lat: Joi.number().required().messages({
            "any.required": "Pickup latitude is required.",
            "number.base": "Pickup latitude must be a number."
        }),

    pickup_lng: Joi.number().required().messages({
            "any.required": "Pickup longitude is required.",
            "number.base": "Pickup longitude must be a number."
        }),

    drop_lat: Joi.number().required().messages({
            "any.required": "Drop latitude is required.",
            "number.base": "Drop latitude must be a number."
        }),

    drop_lng: Joi.number().required().messages({
            "any.required": "Drop longitude is required.",
            "number.base": "Drop longitude must be a number."
        }),

    distance_km: Joi.number().positive().required()
        .messages({
            "any.required": "Distance (KM) is required.",
            "number.base": "Distance (KM) must be a number.",
            "number.positive": "Distance (KM) must be greater than 0."
        }),

    distance_mint: Joi.number().positive().required()
        .messages({
            "any.required": "Distance minutes is required.",
            "number.base": "Distance minutes must be a number.",
            "number.positive": "Distance minutes must be greater than 0."
        }),

    ride_type: Joi.string().valid("city", "intercity").required()
        .messages({
            "any.required": "Ride type is required.",
            "any.only": "Ride type must be either city or intercity."
        })

});

/*
|--------------------------------------------------------------------------
| Ride Request Validator
|--------------------------------------------------------------------------
*/

export const rideRequestValidator = Joi.object({

    vehicle_type_id: Joi.number().integer().positive().required().messages({
            "any.required": "Vehicle type is required.",
            "number.base": "Vehicle type must be a number.",
            "number.integer": "Vehicle type must be an integer.",
            "number.positive": "Vehicle type must be greater than 0."
        }),

    pickup_address: Joi.string().trim().required().messages({
            "any.required": "Pickup address is required.",
            "string.empty": "Pickup address is required."
        }),

    pickup_lat: Joi.number().required().messages({
            "any.required": "Pickup latitude is required.",
            "number.base": "Pickup latitude must be a number."
        }),

    pickup_lng: Joi.number().required().messages({
            "any.required": "Pickup longitude is required.",
            "number.base": "Pickup longitude must be a number."
        }),

    drop_address: Joi.string().trim().required().messages({
            "any.required": "Drop address is required.",
            "string.empty": "Drop address is required."
        }),

    drop_lat: Joi.number().required().messages({
            "any.required": "Drop latitude is required.",
            "number.base": "Drop latitude must be a number."
        }),

    drop_lng: Joi.number().required().messages({
            "any.required": "Drop longitude is required.",
            "number.base": "Drop longitude must be a number."
        }),

    distance_km: Joi.number().positive().required().messages({
            "any.required": "Distance (KM) is required.",
            "number.base": "Distance (KM) must be a number.",
            "number.positive": "Distance (KM) must be greater than 0."
        }),

    duration_minutes: Joi.number().positive().required().messages({
            "any.required": "Duration is required.",
            "number.base": "Duration must be a number.",
            "number.positive": "Duration must be greater than 0."
        }),

    fare_estimate: Joi.number().positive().required().messages({
            "any.required": "Estimated fare is required.",
            "number.base": "Estimated fare must be a number.",
            "number.positive": "Estimated fare must be greater than 0."
        }),

    ride_type: Joi.string().valid("city", "intercity").required().messages({
            "any.required": "Ride type is required.",
            "any.only": "Ride type must be either city or intercity."
        })

});