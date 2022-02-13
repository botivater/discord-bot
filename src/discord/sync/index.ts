import { Client, Guild } from "discord.js";
import PronounChecker from "../../common/pronounChecker";
import Config from "../../common/config";
import database from "@/database";
import { GuildEntity } from "@/database/entities/GuildEntity";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";

export const syncAllUsersInAllGuilds = async (client: Client) => {
    for (const guild of client.guilds.cache.values()) {
        const em = database.getORM().em.fork();
        const guildEntityRepository = em.getRepository(GuildEntity);
        let dbGuild = await guildEntityRepository.findOne({ uid: guild.id });
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
    const channel = client.channels.cache.get(Config.getSystemChannelId());

    const em = database.getORM().em.fork();
    const guildEntityRepository = em.getRepository(GuildEntity);
    const guildMemberEntityRepository = em.getRepository(GuildMemberEntity);
    let dbGuild = await guildEntityRepository.findOneOrFail({ uid: guild.id });

    for (const guildMember of guild.members.cache.values()) {
        if (guildMember.user.bot === true) continue;

        const username =
            guildMember.nickname || guildMember.user.username || "";

        let dbGuildMember = await guildMemberEntityRepository.findOne({
            $and: [ { uid: guildMember.id }, { guild: dbGuild.id } ]
        });

        if (!dbGuildMember) {
            dbGuildMember = new GuildMemberEntity(
                guildMember.id,
                dbGuild,
                username
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
                    content: `Iemand heeft zijn naam veranderd.\nGebruiker: <@${
                        guildMember.user.id
                    }>\nOude naam: ${
                        dbGuildMember.name
                    }\nNieuwe naam: ${username}\nPronouns: ${
                        validPronouns ? "In orde" : "Ongeldig!"
                    }`,
                    allowedMentions: {
                        parse: [],
                    },
                });
            }

            dbGuildMember.name = username;
            await em.flush();
        }
    }
};
