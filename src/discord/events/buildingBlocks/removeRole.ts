import { discordBot } from "../../..";

export type RemoveRoleConfiguration = {
    guildId: string;
    guildMemberId: string;
    roleId: string;
}

const handle = async (configuration: RemoveRoleConfiguration) => {
    const client = discordBot.getDiscord();

    const guild = client.guilds.cache.get(configuration.guildId);
    if (!guild) return;

    const guildMember = guild.members.cache.get(configuration.guildMemberId);
    if (!guildMember) return;

    const role = guild.roles.cache.get(configuration.roleId);
    if (!role) return;

    await guildMember.roles.remove(role);
};

export default {
    handle,
};
