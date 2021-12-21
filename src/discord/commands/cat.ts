// https://aws.random.cat/meow
import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Interaction } from "discord.js";
import fetch from "node-fetch";

export default {
    command: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Laat Mira een kat ophalen en tonen!"),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            interaction.deferReply();
            const { file } = await fetch("https://aws.random.cat/meow").then(
                response => response.json()
            );
            interaction.editReply({ files: [file] });
        } catch (e) {
            interaction.editReply("Miauw! Er is een fout opgetreden!");
        }
    }
};
