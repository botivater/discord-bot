import { Client, Guild } from "discord.js";
import PronounChecker from "../../common/pronounChecker";
import database from "@/database";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";

export const syncAllUsersInAllGuilds = async (client: Client) => {
    for (const guild of client.guilds.cache.values()) {
        const em = database.getORM().em.fork();
        const guildEntityRepository = em.getRepository(GuildEntity);
        let dbGuild = await guildEntityRepository.findOne({ snowflake: guild.id });
        if (!dbGuild) {
            dbGuild = new GuildEntity(guild.id, guild.name);
            em.persist(dbGuild);
            await em.flush();
        }

        await syncAllUsersInGuild(client, guild);
    }
};

export const syncAllUsersInGuild = async (
    client: Client,
    guild: Guild
) => {
    await guild.channels.fetch()
    let channel = guild.channels.cache.find(channel => channel.name == "systeem");
    if (!channel) {
        channel = await guild.channels.create("systeem", {
            type: "GUILD_TEXT"
        });
    }

    const em = database.getORM().em.fork();
    const guildEntityRepository = em.getRepository(GuildEntity);
    const guildMemberEntityRepository = em.getRepository(GuildMemberEntity);
    let dbGuild = await guildEntityRepository.findOneOrFail({ snowflake: guild.id });

    for (const guildMember of guild.members.cache.values()) {
        if (guildMember.user.bot === true) continue;

        const username =
            guildMember.nickname || guildMember.user.username || "";

        const identifier = guildMember.user.tag;

        let dbGuildMember = await guildMemberEntityRepository.findOne({
            $and: [{ snowflake: guildMember.id }, { guild: dbGuild.id }]
        });

        if (!dbGuildMember) {
            dbGuildMember = new GuildMemberEntity(
                guildMember.id,
                dbGuild,
                username,
                identifier
            );
            em.persist(dbGuildMember);
            await em.flush();
        }

        if (dbGuildMember.name !== username) {
            if (channel && channel.isText()) {
                // Check if the username or the nickname contain valid pronouns.
                const validPronouns =
                    PronounChecker.checkString(guildMember.nickname || "") ||
                    PronounChecker.checkString(guildMember.user.username || "");

                channel.send({
                    content: `Iemand heeft zijn naam veranderd.\nGebruiker: <@${guildMember.user.id
                        }>\nOude naam: ${dbGuildMember.name
                        }\nNieuwe naam: ${username}\nPronouns: ${validPronouns ? "In orde" : "Ongeldig!"
                        }`,
                    allowedMentions: {
                        parse: [],
                    },
                });
            }

            dbGuildMember.name = username;
            em.persist(dbGuildMember);
        }

        // Set the name and identifier if the user doesn't have an identifier set.
        // Added after migration to identifier to automatically fill up database.
        if (!dbGuildMember.identifier) {
            dbGuildMember.name = username;
            dbGuildMember.identifier = identifier;
            em.persist(dbGuildMember);
        }
    }

    await em.flush();
};
