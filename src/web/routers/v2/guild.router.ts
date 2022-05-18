import { Router } from "express";
import { guildControllerV2 } from "../../controllers/v2/Guild.controller";

export const guildRouter = Router();

guildRouter.get("/", guildControllerV2.findAll);
guildRouter.get("/:id", guildControllerV2.findOne);
guildRouter.post("/", guildControllerV2.create);
guildRouter.put("/:id", guildControllerV2.update);
guildRouter.delete("/:id", guildControllerV2.delete);
