import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import DiscordService from "../services/discord.service";

class DiscordController {
    public async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.json(APIResponse.fromData(StatusCode.OK, null));
        } catch (e) {
            next(e);
        }
    }

    public async getAllGuilds(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await DiscordService.getAllGuilds();

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }

    public async getGuild(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await DiscordService.getGuild({ id });

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
            const data = await DiscordService.getGuildChannels({
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
            const data = await DiscordService.getGuildMembers({ id });

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
                    await DiscordService.getAllReactionCollectors()
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
                    await DiscordService.getReactionCollector({
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
            const { guildId, channelId, messageText, reactions } = req.body;

            return res.json(
                APIResponse.fromData(
                    StatusCode.OK,
                    await DiscordService.storeReactionCollector({
                        guildId,
                        channelId,
                        messageText,
                        reactions,
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
                    await DiscordService.deleteReactionCollector({
                        id: Number(id),
                    })
                )
            );
        } catch (e) {
            next(e);
        }
    }
}

export default new DiscordController();
