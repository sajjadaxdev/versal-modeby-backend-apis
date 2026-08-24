import Joi from "joi";

const base = {
    vehicle_type_id: Joi.number().integer().positive().required()
        .messages({
            "any.required": "Vehicle type is required",
            "number.base":  "Vehicle type must be a number",
        }),
    multiplier: Joi.number().min(1).max(10).precision(2).required()
        .messages({
            "any.required": "Multiplier is required",
            "number.min":   "Multiplier must be at least 1",
            "number.max":   "Multiplier cannot exceed 10",
        }),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required()
        .messages({
            "any.required":   "Start time is required",
            "string.pattern.base": "Start time must be in HH:MM format",
        }),
    end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required()
        .messages({
            "any.required":   "End time is required",
            "string.pattern.base": "End time must be in HH:MM format",
        }),
    is_active: Joi.boolean().default(true),
};

export const validateCreateSurgePricing = Joi.object(base);

export const validateUpdateSurgePricing = Joi.object({
    ...base,
    vehicle_type_id: base.vehicle_type_id.optional(),
    multiplier:      base.multiplier.optional(),
    start_time:      base.start_time.optional(),
    end_time:        base.end_time.optional(),
});