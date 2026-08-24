import logger from "../utils/logger.js";
import { deleteUploadedFile } from "../helpers/fileHelper.js";


export const errorHandler = (err, req, res, next) => {

  if (req.file) {
    deleteUploadedFile(req.file);
  }

  const statusCode = err.statusCode || 500;
  const formattedErrors = Array.isArray(err.errors)
    ? err.errors
    : err.errors
    ? [err.errors]
    : [];

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body
  });


  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errorType: err.errorType || "Server Error",
    errors: formattedErrors,
  });
};
