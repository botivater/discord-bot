import RouteNotFoundError from "../error/RouteNotFoundError";
import { NextFunction, Request, Response } from "express";

export const routingErrorHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next(new RouteNotFoundError(req.path));
};
