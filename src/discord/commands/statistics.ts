import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, Interaction } from "discord.js";
import { logger } from "../../logger";
import { checkRole } from "../../common";
import logUsage from "../helpers/logUsage";
import Role from "@/common/role";
import commandUsageService from "@/web/services/commandUsage.service";

export default {
    command: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Show me dem stats!")
        .setDefaultPermission(false),
    async handle(interaction: Interaction) {
        if (!interaction.isCommand()) return;

        try {
            await interaction.deferReply();

            if (!checkRole(<GuildMember> interaction.member, [Role.OWNER, Role.DEVELOPER, Role.MODERATOR])) {
                let content = '';
                const statistics = await commandUsageService.findAll();

                for (const statistic of statistics) {
                    content += `/${statistic.commandName} is ${statistic.invocations} keer gebruikt.\n`;
                }

                await interaction.editReply({
                    content
                })

                await logUsage.interaction(interaction);
            } else {
                await interaction.editReply(
                    "Dit commando mag jij niet uitvoeren."
                );
            }
        } catch (e) {
            logger.error(e);
            await interaction.editReply("Miauw! Er is een fout opgetreden!");
        }
    },
};
