import { Guild, PrismaClient } from "@prisma/client";
import database from "../../../database";
import GuildNotFoundError from "../../../errors/GuildNotFoundError";
import { IService } from "../IService";

class GuildServiceV2 implements IService<Guild> {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = database.getPrisma();
    }

    async findAll(): Promise<Guild[]> {
        return this.prisma.guild.findMany();
    }

    async findOne(data: { id: number }): Promise<Guild> {
        const guild = await this.prisma.guild.findFirst({
            where: {
                id: {
                    equals: data.id
                }
            }
        });
        if (!guild) throw new GuildNotFoundError(String(data.id));

        return guild;
    }

    async create(data: Guild): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    async update(where: Guild, data: Guild): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    async delete(data: Guild): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    public async getAllGuildMembers() {
        return this.prisma.guildMember.findMany();
    }
}

export const guildServiceV2 = new GuildServiceV2();
