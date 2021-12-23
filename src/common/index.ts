import { GuildMember } from "discord.js";
import Config from "./config";

export const roles = {
  OWNER: Config.getOwnerRoleId(),
  MODERATOR: Config.getModeratorRoleId(),
  DEVELOPER: Config.getDeveloperRoleId(),
};

export const isMemberDeveloper = (member: GuildMember): boolean => {
  const developerRoleId = Config.getDeveloperRoleId();

  return member.roles.cache.some((role) => role.id === developerRoleId);
};

export const checkRole = (member: GuildMember, roles: string[]): boolean => {
  return member.roles.cache.some((role) => roles.includes(role.id));
};
