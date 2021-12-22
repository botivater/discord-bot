import { GuildMember } from "discord.js";
import Config from "./config";

export const isMemberDeveloper = (member: GuildMember): boolean => {
    const developerRoleId = Config.getDeveloperRoleId();

    return member.roles.cache.some(role => role.id === developerRoleId);
};