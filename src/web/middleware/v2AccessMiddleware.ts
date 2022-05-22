import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Handler } from "express";
import { container } from "../../configureContainer";
import { UnauthorizedError } from "../error/UnauthorizedError";


export const v2AccessMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!req.params.guildId) return next(new UnauthorizedError());

    const prisma: PrismaClient = container.resolve('prisma');
    const accessList = await prisma.accessList.findUnique({
        where: {
            id: req.user.accessListId
        },
        include: {
            guilds: true
        }
    });

    if (!accessList?.guilds.find(guild => guild.id === Number(req.params.guildId))) return next(new UnauthorizedError());
    next();
};
