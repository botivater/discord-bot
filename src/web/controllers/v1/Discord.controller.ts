import { NextFunction, Request, Response } from "express";
import { container } from "../../../configureContainer";
import { StatusCode } from "../../enum/StatusCode";
import APIResponse from "../../responses/APIResponse";
import { DiscordService } from "../../services/v1/discord.service";


export class DiscordController {
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

    public async getAllGuilds(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.discordService.getAllGuilds();

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getGuild(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await this.discordService.getGuild({ id });

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getGuildChannels(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { type = "" } = req.query;
            const data = await this.discordService.getGuildChannels({
                id,
                type: <string>type,
            });

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getGuildMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const data = await this.discordService.getGuildMembers({ id });

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getGuildRoles(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const data = await this.discordService.getGuildRoles({ id });

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getAllReactionCollectors(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.discordService.getAllReactionCollectors()
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async getReactionCollector(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.discordService.getReactionCollector({
                        id: Number(id),
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async createReactionCollector(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const {
                guildId,
                name,
                description,
                type,
                channelId,
                messageText,
                reactions,
                commandFlows
            } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.discordService.storeReactionCollector({
                        guildId,
                        name,
                        description,
                        type: Number(type),
                        channelId,
                        messageText,
                        reactions,
                        commandFlows,
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }

    public async deleteReactionCollector(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await this.discordService.deleteReactionCollector({
                        id: Number(id),
                    })
                )
            );
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}
