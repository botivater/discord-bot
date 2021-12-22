import winston from "winston";

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ssZ" }),
        winston.format.align(),
        winston.format.printf(
          (info) =>
            `${[info.timestamp]} [${info.level.toUpperCase()}] ${info.message}`
        )
      ),
    }),
  ],
});
