import { NextFunction, Request, Response } from "express";
import APIResponse from "../responses/APIResponse";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response = APIResponse.fromError(err);

    if (
        req.headers.accept &&
        req.headers.accept.toLowerCase() === "application/json"
    ) {
        return res.status(response.statusCode).json(response);
    }

    return next(err);
};
