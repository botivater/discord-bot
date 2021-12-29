import { NextFunction, Request, Response } from "express";

/*
 * This middleware is designed for testing.
 * It generates a random wait time for each request between 0 and 1 seconds.
 * It's mainly used for testing how the front-end deals with delayed requests.
 */
export const randomPause = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const waitPeriod = Math.random() * 1000;

    await new Promise((resolve) => {
        setTimeout(resolve, waitPeriod);
    });
    next();
};
