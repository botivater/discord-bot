import winston from "winston";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ssZ" }),
                winston.format.align(),
                winston.format.printf(
                    (info) =>
                        `${[info.timestamp]} [${info.level.toUpperCase()}] ${
                            info.message
                        }`
                )
            ),
        }),
    ],
});

export default logger;
