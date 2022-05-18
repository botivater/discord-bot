import { Router } from "express";
import { guildMemberControllerV2 } from "../../controllers/v2/GuildMember.controller";

export const guildMemberRouter = Router();

guildMemberRouter.get("/", guildMemberControllerV2.findAll);
guildMemberRouter.get("/:id", guildMemberControllerV2.findOne);
guildMemberRouter.post("/", guildMemberControllerV2.create);
guildMemberRouter.put("/:id", guildMemberControllerV2.update);
guildMemberRouter.delete("/:id", guildMemberControllerV2.delete);
