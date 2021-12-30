import GuildChannelNotFoundError from "@/errors/GuildChannelNotFoundError";
import { NextFunction, Request, Response, Router } from "express";
import { FriendshipBubble } from "typings/FriendshipBubble";
import APIResponseDto from "../dto/APIResponse.dto";
import { StatusCode } from "../enum/StatusCode";
import APIResponse from "../responses/APIResponse";
import {
    getAllGuilds,
    getGuild,
    getGuildChannels,
    getGuildMembers,
    speak,
} from "../services/discord";

export const discordRouter = Router();

discordRouter.get("/", async (req, res) => {
    return res.json({ status: "OK" });
});

discordRouter.get(
    "/guilds",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await getAllGuilds();

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }
);

discordRouter.get(
    "/guilds/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await getGuild(id);

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }
);

discordRouter.get(
    "/guilds/:id/channels",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { type = "" } = req.query;
            const data = await getGuildChannels(id, <string>type);

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }
);

discordRouter.get(
    "/guilds/:id/members",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await getGuildMembers(id);

            return res.json(APIResponse.fromData(StatusCode.OK, data));
        } catch (e) {
            next(e);
        }
    }
);
