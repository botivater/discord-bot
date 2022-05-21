import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { DiscordService } from "../../services/v1/discord.service";


export class MiraController {
    private discordService: DiscordService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.discordService = container.resolve('discordService');
    }

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
            await this.discordService.sendMessage({ channelId, message });

            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }
}
