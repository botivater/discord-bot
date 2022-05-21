import { PrismaClient } from "@prisma/client";
import { Interaction } from "discord.js";
import logger from "../../logger";

export class LogUsage {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async interaction(interaction: Interaction) {
        if (!interaction.isCommand()) {
            logger.error(`Interaction is not a command!`);
            return;
        };

        if (!interaction.guild) {
            logger.error(`Interaction does not contain guild!`);
            return;
        }

        const dbGuild = await this.prisma.guild.findFirst({
            where: {
                snowflake: interaction.guild?.id
            }
        });

        if (!dbGuild) {
            logger.error(
                `Could not find guild with id: ${interaction.guild?.id}`
            );
            return;
        }

        const dbGuildMember = await this.prisma.guildMember.findFirst({
            where: {
                AND: [
                    {
                        snowflake: interaction.member?.user.id
                    },
                    {
                        guildId: dbGuild.id
                    }
                ]
            }
        });

        if (!dbGuildMember) {
            logger.error(
                `Could not find guild member with id: ${interaction.member?.user.id}`
            );
            return;
        }

        await this.prisma.commandInvocation.create({
            data: {
                commandName: interaction.commandName,
                guildId: dbGuild.id,
                guildMemberId: dbGuildMember.id
            }
        })
    }
}
