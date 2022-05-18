import { Router } from "express";

// Routers
import { guildRouter } from "./v2/guild.router";
import { guildMemberRouter } from "./v2/guildMember.router";

export const v2Router = Router();

v2Router.use("/guild", guildRouter);
v2Router.use("/guildMember", guildMemberRouter);
