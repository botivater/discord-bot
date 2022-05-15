import NotImplementedError from "../../errors/NotImplementedError";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import discordBotService from "../services/discordBot.service";

class DiscordBotController {
    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async reloadCommands(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await discordBotService.reloadCommands()
                )
            );
        } catch (e) {
            next(e);
        }
    }
}

export default new DiscordBotController();
