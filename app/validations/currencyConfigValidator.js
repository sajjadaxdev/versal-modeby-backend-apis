import Joi from "joi";

const base = {
    name:               Joi.string().trim().max(100).required()
                            .messages({ "string.empty": "Currency name is required" }),
    code:               Joi.string().trim().uppercase().max(10).required()
                            .messages({ "string.empty": "Currency code is required (e.g. PKR)" }),
    symbol:             Joi.string().trim().max(10).required()
                            .messages({ "string.empty": "Symbol is required (e.g. Rs)" }),
    symbol_position:    Joi.string().valid("before", "after").default("before"),
    decimal_places:     Joi.number().integer().min(0).max(4).default(2),
    decimal_separator:  Joi.string().max(5).default("."),
    thousand_separator: Joi.string().max(5).default(","),
    is_default:         Joi.boolean().default(false),
    is_active:          Joi.boolean().default(true),
};

export const validateCreateCurrency = Joi.object(base);

export const validateUpdateCurrency = Joi.object({
    ...base,
    name:    base.name.optional(),
    code:    base.code.optional(),
    symbol:  base.symbol.optional(),
});