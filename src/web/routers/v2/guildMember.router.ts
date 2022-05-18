import { Router } from "express";
import { guildMemberControllerV2 } from "../../controllers/v2/GuildMember.controller";

export const guildMemberRouter = Router();

guildMemberRouter.get("/", guildMemberControllerV2.findAll.bind(guildMemberControllerV2));
guildMemberRouter.get("/:id", guildMemberControllerV2.findOne.bind(guildMemberControllerV2));
guildMemberRouter.post("/", guildMemberControllerV2.create.bind(guildMemberControllerV2));
guildMemberRouter.put("/:id", guildMemberControllerV2.update.bind(guildMemberControllerV2));
guildMemberRouter.delete("/:id", guildMemberControllerV2.delete.bind(guildMemberControllerV2));
