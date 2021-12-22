import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { isMemberDeveloper } from "../../common";

export default {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Laat Mira 'Pong!' zeggen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        if (isMemberDeveloper(<GuildMember>interaction.member)) {
            await interaction.reply("Pong! Pong! Pong!");
        } else {
            await interaction.reply("Pong!");
        }
    }
};
