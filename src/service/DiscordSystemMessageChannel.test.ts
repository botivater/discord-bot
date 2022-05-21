jest.mock('discord.js')
jest.mock('../database/entities/GuildEntity')

import { DiscordSystemMessageChannel } from "./DiscordSystemMessageChannel";
import Discord, { Intents } from "discord.js";
import { Guild } from "@prisma/client";

test('DiscordSystemMessageChannel constructs', () => {
    const discordClient = new Discord.Client({
        intents: []
    });
    const databaseGuild: Guild = {
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Test",
        snowflake: "1234",
        configId: null
    }

    const discordSystemMessageChannel = new DiscordSystemMessageChannel(discordClient, databaseGuild);

    expect(discordSystemMessageChannel).toBeInstanceOf(DiscordSystemMessageChannel);
});

// test('DiscordSystemMessageChannel send a message', () => {
//     const discordClient = new Discord.Client({
//         intents: []
//     });
//     const databaseGuild = new GuildEntity("1234", "Test");

    

//     const discordSystemMessageChannel = new DiscordSystemMessageChannel(discordClient, databaseGuild);

//     expect(discordSystemMessageChannel.send("This is a test."));
// });