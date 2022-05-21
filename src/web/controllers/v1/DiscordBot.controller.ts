import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { DiscordBotService } from "../../services/v1/discordBot.service";


export class DiscordBotController {
    private discordBotService: DiscordBotService;

    /**
     * Create a new instance.
     * This class utilises Dependency Injection to get the correct services.
     */
    constructor() {
        this.discordBotService = container.resolve('discordBotService');
    }

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
                    await this.discordBotService.reloadCommands()
                )
            );
        } catch (e) {
            next(e);
        }
    }
}
