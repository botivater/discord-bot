import NotImplementedError from "@/errors/NotImplementedError";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import commandListService from "../services/commandList.service";

class CommandController {
    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async getAllListCommands(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.findAllListCommands()
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async getListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            throw new NotImplementedError(req.originalUrl);
        } catch (e) {
            next(e);
        }
    }

    public async createListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { name, description, options, guildId } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.storeListCommands({ name, description, options, guildId })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async updateListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            throw new NotImplementedError(req.originalUrl);
        } catch (e) {
            next(e);
        }
    }

    public async deleteListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            throw new NotImplementedError(req.originalUrl);
        } catch (e) {
            next(e);
        }
    }

    public async attachListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { commandListId, guildId } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.attachListCommandToGuild({ commandListId, guildId })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async detachListCommand(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            throw new NotImplementedError(req.originalUrl);
        } catch (e) {
            next(e);
        }
    }
}

export default new CommandController();
