import { GuildMember } from "discord.js";
import Config from "./config";

export const isMemberDeveloper = (member: GuildMember): boolean => {
    const developerRoleId = Config.getDeveloperRoleId();

    for (const role in member.roles) {
        if (role === developerRoleId) return true;
    }

    return false;
};