import NotImplementedError from "../../error/NotImplementedError";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import commandListService from "../../services/v1/commandList.service";
import commandUsageService from "../../services/v1/commandUsage.service";

class CommandController {
    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async getAllUsage(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, await commandUsageService.findAll()));
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
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.findListCommand({ id: Number(id) })
                )
            );
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
                    await commandListService.storeListCommand({ name, description, options, guildId })
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
            const { id } = req.params;
            const { name, description, options } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.updateListCommand({ id: Number(id) }, { name, description, options })
                )
            );
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
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await commandListService.deleteListCommand({ id: Number(id) })
                )
            );
        } catch (e) {
            next(e);
        }
    }
}

export default new CommandController();
