import { Client, Guild } from "discord.js";
import PronounChecker from "../../common/pronounChecker";
import Config from "../../common/config";
import { knex } from "../../common/database";

export const syncAllUsersInAllGuilds = async function (client: Client) {
  for (const guild of client.guilds.cache.values()) {
    const dbGuild = await knex("guilds").where("uid", guild.id).first();
    if (!dbGuild) {
      await knex("guilds").insert({
        uid: guild.id,
        name: guild.name,
      });
    }

    syncAllUsersInGuild(client, guild);
  }
};

export const syncAllUsersInGuild = async function (
  client: Client,
  guild: Guild
) {
  const channel = client.channels.cache.get(Config.getSystemChannelId());

  const dbGuild = await knex("guilds").where("uid", guild.id).first();

  for (const guildMember of guild.members.cache.values()) {
    if (guildMember.user.bot === true) continue;

    const username = guildMember.nickname || guildMember.user.username || "";

    let dbGuildMember = await knex("guild_members")
      .where("uid", guildMember.id)
      .first();
    if (!dbGuildMember) {
      await knex("guild_members").insert({
        guild_id: dbGuild.id,
        uid: guildMember.id,
        name: username,
      });

      dbGuildMember = await knex("guild_members")
        .where("uid", guildMember.id)
        .first();
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

      await knex("guild_members").where("id", dbGuildMember.id).update({
        name: username,
      });
    }
  }
};
