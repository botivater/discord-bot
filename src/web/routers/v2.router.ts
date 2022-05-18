import { Router } from "express";

// Routers
import { guildRouter } from "./v2/guild.router";
import { guildConfigRouter } from "./v2/guildConfig.router";
import { guildMemberRouter } from "./v2/guildMember.router";
import { welcomeMessageConfigRouter } from "./v2/welcomeMessageConfig.router";

export const v2Router = Router();

v2Router.use("/guild", guildRouter);
v2Router.use("/guildMember", guildMemberRouter);
v2Router.use("/guildConfig", guildConfigRouter);
v2Router.use("/welcomeMessageConfig", welcomeMessageConfigRouter);
