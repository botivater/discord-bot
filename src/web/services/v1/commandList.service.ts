import GuildNotFoundError from "../../error/GuildNotFoundError";
import { PrismaClient } from "@prisma/client";

export class CommandListService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async findAllListCommands() {
        return await this.prisma.commandList.findMany();
    }

    public async findListCommand(data: { id: number }) {
        const { id } = data;

        const dbCommandList = await this.prisma.commandList.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        });
        if (!dbCommandList) throw new Error("Not found error");

        return dbCommandList;
    }

    public async storeListCommand(data: {
        name: string;
        description: string;
        options: string[];
        guildId: number;
    }) {
        const { name, description, options, guildId } = data;

        const dbGuild = await this.prisma.guild.findFirst({
            where: {
                id: {
                    equals: guildId
                }
            }
        });
        if (!dbGuild) throw new GuildNotFoundError();

        const commandListEntity = await this.prisma.commandList.create({
            data: {
                name,
                description,
                options,
                guildId: dbGuild.id
            }
        });

        return commandListEntity;
    }

    public async updateListCommand(
        find: {
            id: number;
        },
        data: { name: string; description: string; options: string[] }
    ) {
        const { id } = find;
        const { name, description, options } = data;

        const dbCommandList = await this.prisma.commandList.update({
            where: {
                id: id
            },
            data: {
                name,
                description,
                options
            }
        });
        if (!dbCommandList) throw new Error("Not found error");

        return dbCommandList;
    }

    public async deleteListCommand(data: { id: number }) {
        const { id } = data;

        const dbCommandList = await this.prisma.commandList.delete({
            where: {
                id: id
            }
        });
        if (!dbCommandList) throw new Error("Not found error");

        return null;
    }
}
