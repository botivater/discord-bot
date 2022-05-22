import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response, Handler } from "express";
import { container } from "../../configureContainer";
import { UnauthorizedError } from "../error/UnauthorizedError";


declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const userHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.auth) return next();
    const { payload } = req.auth;
    const { sub } = payload;
    if (!sub) return next();

    const prisma: PrismaClient = container.resolve('prisma');
    const user = await prisma.user.findUnique({
        where: {
            auth0Sub: sub
        }
    });
    if (!user) return next();

    req.user = user;

    return next();
};
