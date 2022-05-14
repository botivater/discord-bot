import { Router } from "express";
import DiscordController from "../../controllers/Discord.controller";

export const discordRouter = Router();

// Index
discordRouter.get("/", DiscordController.index);

// Guilds
discordRouter.get("/guilds", DiscordController.getAllGuilds);
discordRouter.get("/guilds/:id", DiscordController.getGuild);
discordRouter.get("/guilds/:id/channels", DiscordController.getGuildChannels);
discordRouter.get("/guilds/:id/members", DiscordController.getGuildMembers);
discordRouter.get("/guilds/:id/roles", DiscordController.getGuildRoles);

// Reaction collector
discordRouter.get("/reactionCollectors", DiscordController.getAllReactionCollectors);
discordRouter.get("/reactionCollectors/:id", DiscordController.getReactionCollector);
discordRouter.post("/reactionCollectors", DiscordController.createReactionCollector);
discordRouter.delete("/reactionCollectors/:id", DiscordController.deleteReactionCollector);
