import { Router } from "express";
import GuildMemberController from "../../controllers/v1/GuildMember.controller";

export const guildMemberRouter = Router();

guildMemberRouter.get("/", GuildMemberController.getAllGuildMembers);
guildMemberRouter.get("/:id", GuildMemberController.getGuildMember);
