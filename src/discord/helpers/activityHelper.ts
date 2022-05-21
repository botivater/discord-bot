import { PrismaClient } from "@prisma/client";
import { Snowflake } from "discord.js";
import { Discord } from "..";


export class ActivityHelper {
    private discord: Discord;
    private prisma: PrismaClient;

    /**
     *
     */
    constructor(discord: Discord, prisma: PrismaClient) {
        this.discord = discord;
        this.prisma = prisma;
    }

    public async registerActivity(data: {
        guildUid: Snowflake;
        guildMemberUid: Snowflake;
        timestamp: Date;
    }) {
        const { guildUid, guildMemberUid, timestamp } = data;

        if (!guildUid || !guildMemberUid || !timestamp) {
            throw new Error("Missing parameter");
        }

        const dbGuildMember = await this.prisma.guildMember.findFirst({
            where: {
                AND: [
                    {
                        snowflake: guildMemberUid
                    },
                    {
                        guild: {
                            snowflake: guildUid
                        }
                    }
                ]
            },
            include: {
                guild: true
            }
        });
        if (!dbGuildMember) {
            throw new Error("Guild member not found");
        }

        await this.prisma.guildMember.update({
            where: {
                id: dbGuildMember.id
            },
            data: {
                lastInteraction: timestamp,
                active: true
            }
        });

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

        const guild = this.discord.guilds.cache.get(guildUid);
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

        const guild = this.discord.guilds.cache.get(guildUid);
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

        const guild = this.discord.guilds.cache.get(guildUid);
        if (!guild) throw new Error("Guild not found");

        const guildMember = guild.members.cache.get(guildMemberUid);
        if (!guildMember) throw new Error("Guild member not found");

        await guildMember.roles.remove("922109645030555680");
    }
}
