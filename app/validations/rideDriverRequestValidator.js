import Joi from "joi";


/*
|--------------------------------------------------------------------------
| Driver Ride Request Response Validator
|--------------------------------------------------------------------------
*/

export const rideDriverRequestResponseValidator = Joi.object({

    status: Joi.string().valid("accepted", "rejected").required().messages({
        "any.required": "Request status is required.",
        "any.only": "Request status must be either accepted or rejected.",
    }),

});