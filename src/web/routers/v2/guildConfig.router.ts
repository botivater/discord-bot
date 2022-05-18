import { Router } from "express";
import { guildConfigControllerV2 } from "../../controllers/v2/GuildConfig.controller";

export const guildConfigRouter = Router();

guildConfigRouter.get("/", guildConfigControllerV2.findAll.bind(guildConfigControllerV2));
guildConfigRouter.get("/:id", guildConfigControllerV2.findOne.bind(guildConfigControllerV2));
guildConfigRouter.post("/", guildConfigControllerV2.create.bind(guildConfigControllerV2));
guildConfigRouter.put("/:id", guildConfigControllerV2.update.bind(guildConfigControllerV2));
guildConfigRouter.delete("/:id", guildConfigControllerV2.delete.bind(guildConfigControllerV2));
