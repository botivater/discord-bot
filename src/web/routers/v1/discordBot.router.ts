import { Router } from "express";
import DiscordBotController from "../../controllers/v1/DiscordBot.controller";

export const discordBotRouter = Router();

discordBotRouter.get("/", DiscordBotController.index);
discordBotRouter.get("/reload/commands", DiscordBotController.reloadCommands);
