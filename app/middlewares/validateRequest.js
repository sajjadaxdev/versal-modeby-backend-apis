import { AppError } from "../utils/AppError.js";

export const validateRequest = (schema) => {
    return (req, res, next) => {

        const { error } = schema.validate(req.body ?? {}, {
            abortEarly: false,
            allowUnknown: false,
        });

        if (error) {

            const errors = error.details.map((d) => d.message);

            const err = new AppError("Validation failed");

            err.statusCode = 400;
            err.errorType = "validation";
            err.errors = errors;

            return next(err);
        }

        next();
    };
};