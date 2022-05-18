import { GuildMember, PrismaClient } from "@prisma/client";
import database from "../../../database";
import GuildMemberNotFoundError from "../../../errors/GuildMemberNotFoundError";
import GuildNotFoundError from "../../../errors/GuildNotFoundError";
import { IService } from "../IService";

class GuildMemberServiceV2 implements IService<GuildMember> {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = database.getPrisma();
    }

    async findAll(): Promise<GuildMember[]> {
        return this.prisma.guildMember.findMany();
    }

    async findOne(data: { id: number }): Promise<GuildMember> {
        const guildMember = await this.prisma.guildMember.findFirst({
            where: {
                id: {
                    equals: data.id
                }
            }
        });
        if (!guildMember) throw new GuildMemberNotFoundError(String(data.id));

        return guildMember;
    }

    async create(data: GuildMember): Promise<GuildMember> {
        throw new Error("Method not implemented.");
    }

    async update(where: GuildMember, data: GuildMember): Promise<GuildMember> {
        throw new Error("Method not implemented.");
    }

    async delete(data: GuildMember): Promise<GuildMember> {
        throw new Error("Method not implemented.");
    }
}

export const guildMemberServiceV2 = new GuildMemberServiceV2();
