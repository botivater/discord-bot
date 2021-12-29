import { Router } from "express";
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

discordRouter.get("/guilds", async (req, res) => {
    try {
        const data = await getAllGuilds();

        return res.json(APIResponse.fromData(StatusCode.OK, data));
    } catch (e) {
        if (e instanceof Error) {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    e.message
                )
            );
        } else {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    "Unknown error!"
                )
            );
        }
    }
});

discordRouter.get("/guilds/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getGuild(id);

        return res.json(APIResponse.fromData(StatusCode.OK, data));
    } catch (e) {
        if (e instanceof Error) {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    e.message
                )
            );
        } else {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    "Unknown error!"
                )
            );
        }
    }
});

discordRouter.get("/guilds/:id/channels", async (req, res) => {
    try {
        const { id } = req.params;
        const { type = "" } = req.query;
        const data = await getGuildChannels(id, <string>type);

        return res.json(APIResponse.fromData(StatusCode.OK, data));
    } catch (e) {
        if (e instanceof Error) {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    e.message
                )
            );
        } else {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    "Unknown error!"
                )
            );
        }
    }
});

discordRouter.get("/guilds/:id/members", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getGuildMembers(id);

        return res.json(APIResponse.fromData(StatusCode.OK, data));
    } catch (e) {
        if (e instanceof Error) {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    e.message
                )
            );
        } else {
            return res.json(
                APIResponse.fromError(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    "Unknown error!"
                )
            );
        }
    }
});
