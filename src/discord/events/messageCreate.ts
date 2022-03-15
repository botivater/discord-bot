import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { Message, PartialMessage } from "discord.js";

const handle = async (message: Message | PartialMessage) => {
    if (message.partial) await message.fetch();

    const { author, guildId, createdTimestamp } = message;

    if (!author || !guildId) {
        return;
    }

    const em = database.getORM().em.fork();
    const dbGuildMember = await em.findOne(
        GuildMemberEntity,
        {
            $and: [
                {
                    uid: author.id,
                },
                {
                    guild: {
                        uid: guildId,
                    },
                },
            ],
        },
        { populate: ["guild"] }
    );

    // TODO: Add user to database of known members when it is not found
    if (!dbGuildMember) {
        return;
    }

    dbGuildMember.lastInteraction = new Date(createdTimestamp);
    
    // TODO: Reactivate user by removing role
    dbGuildMember.active = true;

    em.persist(dbGuildMember);
    await em.flush();
};

export default {
    handle,
};
