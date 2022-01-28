import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import DiscordService from "../services/discord.service";

class MiraController {
    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async speak(req: Request, res: Response, next: NextFunction) {
        try {
            const { channelId, message } = req.body;
            await DiscordService.sendMessage({ channelId, message });

            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }
}

export default new MiraController();
