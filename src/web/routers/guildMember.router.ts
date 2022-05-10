import { Router } from "express";
import GuildMemberController from "../controllers/GuildMember.controller";

export const guildMemberRouter = Router();

guildMemberRouter.get("/", GuildMemberController.getAllGuildMembers);
guildMemberRouter.get("/:id", GuildMemberController.getGuildMember);
