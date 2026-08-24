import winston from "winston";
import "winston-daily-rotate-file";

const dailyRotateFile = new winston.transports.DailyRotateFile({
    filename: "logs/%DATE%-error.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d", // 14 din tak save
});

const combinedRotateFile = new winston.transports.DailyRotateFile({
    filename: "logs/%DATE%-combined.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        dailyRotateFile,
        combinedRotateFile,
        new winston.transports.Console()
    ],
});

export default logger;