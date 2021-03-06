import { Discord } from "../..";
import { container } from "../../../configureContainer";

export type AddRoleConfiguration = {
    guildId: string;
    guildMemberId: string;
    roleId: string;
}

const handle = async (configuration: AddRoleConfiguration) => {
    const client: Discord = container.resolve('discord');

    const guild = client.guilds.cache.get(configuration.guildId);
    if (!guild) return;

    const guildMember = guild.members.cache.get(configuration.guildMemberId);
    if (!guildMember) return;

    const role = guild.roles.cache.get(configuration.roleId);
    if (!role) return;

    await guildMember.roles.add(role);
};

export default {
    handle,
};
