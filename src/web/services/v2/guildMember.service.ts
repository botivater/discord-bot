import { GuildMember, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../error/NotFoundError";
import { IService } from "../IService";

export class GuildMemberNotFound extends NotFoundError {};
export class GuildMemberNotCreated extends Error {};

export class GuildMemberServiceV2 implements IService<GuildMember> {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(): Promise<GuildMember[]> {
        return this.prisma.guildMember.findMany();
    }

    async findOne(where: Prisma.GuildMemberWhereUniqueInput): Promise<GuildMember> {
        const guildMember = await this.prisma.guildMember.findUnique({
            where
        });
        if (!guildMember) throw new GuildMemberNotFound(String(where.id));

        return guildMember;
    }

    async create(data: Prisma.GuildMemberCreateInput): Promise<GuildMember> {
        throw new Error("Method not implemented.");
    }

    async update(where: Prisma.GuildMemberWhereUniqueInput, data: Prisma.GuildMemberCreateInput): Promise<GuildMember> {
        throw new Error("Method not implemented.");
    }

    async delete(where: Prisma.GuildMemberWhereUniqueInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
