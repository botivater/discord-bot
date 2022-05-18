import { Router } from "express";
import { guildControllerV2 } from "../../controllers/v2/Guild.controller";

export const guildRouter = Router();

guildRouter.get("/", guildControllerV2.findAll.bind(guildControllerV2));
guildRouter.get("/:id", guildControllerV2.findOne.bind(guildControllerV2));
guildRouter.post("/", guildControllerV2.create.bind(guildControllerV2));
guildRouter.put("/:id", guildControllerV2.update.bind(guildControllerV2));
guildRouter.delete("/:id", guildControllerV2.delete.bind(guildControllerV2));
