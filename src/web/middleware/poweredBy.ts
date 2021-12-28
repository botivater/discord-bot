import { NextFunction, Request, Response } from "express";

export const poweredBy = (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Powered-By", "Mira;");
    next();
};
