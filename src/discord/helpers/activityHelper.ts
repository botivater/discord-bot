import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { Snowflake } from "discord.js";
import discord from "..";

class ActivityHelper {
    public async registerActivity(data: {
        guildUid: Snowflake;
        guildMemberUid: Snowflake;
        timestamp: Date;
    }) {
        const { guildUid, guildMemberUid, timestamp } = data;

        if (!guildUid || !guildMemberUid || !timestamp) {
            throw new Error("Missing parameter");
        }

        const em = database.getORM().em.fork();
        const dbGuildMember = await em.findOne(
            GuildMemberEntity,
            {
                $and: [
                    {
                        snowflake: guildMemberUid,
                    },
                    {
                        guild: {
                            snowflake: guildUid,
                        },
                    },
                ],
            },
            { populate: ["guild"] }
        );

        if (!dbGuildMember) {
            throw new Error("Guild member not found");
        }

        dbGuildMember.lastInteraction = timestamp;
        dbGuildMember.active = true;

        em.persist(dbGuildMember);
        await em.flush();

        const hasRole = await this.hasInactiveRole({
            guildUid,
            guildMemberUid,
        });

        hasRole
            ? await this.removeInactiveRole({
                  guildUid,
                  guildMemberUid,
              })
            : null;
    }

    public async hasInactiveRole(data: {
        guildUid: Snowflake;
        guildMemberUid: Snowflake;
    }) {
        const { guildUid, guildMemberUid } = data;

        const discordClient = discord.getClient();

        const guild = discordClient.guilds.cache.get(guildUid);
        if (!guild) throw new Error("Guild not found");

        const guildMember = guild.members.cache.get(guildMemberUid);
        if (!guildMember) throw new Error("Guild member not found");

        const role = guildMember.roles.cache.find(
            (value) => value.id === "922109645030555680"
        );

        return !!role;
    }

    public async addInactiveRole(data: {
        guildUid: Snowflake;
        guildMemberUid: Snowflake;
    }) {
        const { guildUid, guildMemberUid } = data;

        const discordClient = discord.getClient();

        const guild = discordClient.guilds.cache.get(guildUid);
        if (!guild) throw new Error("Guild not found");

        const guildMember = guild.members.cache.get(guildMemberUid);
        if (!guildMember) throw new Error("Guild member not found");

        await guildMember.roles.add("922109645030555680");
    }

    public async removeInactiveRole(data: {
        guildUid: Snowflake;
        guildMemberUid: Snowflake;
    }) {
        const { guildUid, guildMemberUid } = data;

        const discordClient = discord.getClient();

        const guild = discordClient.guilds.cache.get(guildUid);
        if (!guild) throw new Error("Guild not found");

        const guildMember = guild.members.cache.get(guildMemberUid);
        if (!guildMember) throw new Error("Guild member not found");

        await guildMember.roles.remove("922109645030555680");
    }
}

export default new ActivityHelper();
