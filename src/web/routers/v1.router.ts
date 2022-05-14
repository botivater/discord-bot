import { Router } from "express";
import { miraRouter } from "./v1/mira";
import { discordRouter } from "./v1/discord.router";
import { commandRouter } from "./v1/command.router";
import { discordBotRouter } from "./v1/discordBot.router";
import { reportRouter } from "./v1/report.router";
import { guildMemberRouter } from "./v1/guildMember.router";

export const v1Router = Router();

v1Router.use("/discord", discordRouter);
v1Router.use("/mira", miraRouter);
v1Router.use("/command", commandRouter);
v1Router.use("/discord-bot", discordBotRouter);
v1Router.use("/report", reportRouter);
v1Router.use("/guildMember", guildMemberRouter);