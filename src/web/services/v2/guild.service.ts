import { Guild, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../error/NotFoundError";
import { IGuildService } from "./IGuild.service";


export class GuildNotFound extends NotFoundError {};
export class GuildNotCreated extends Error {};

export class GuildServiceV2 implements IGuildService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(where: Prisma.GuildWhereInput): Promise<Guild[]> {
        return this.prisma.guild.findMany({
            where
        });
    }

    async findOne(where: Prisma.GuildWhereUniqueInput): Promise<Guild> {
        const guild = await this.prisma.guild.findUnique({
            where
        });
        if (!guild) throw new GuildNotFound(String(where.id));

        return guild;
    }

    async create(data: Prisma.GuildCreateInput): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    async update(where: Prisma.GuildWhereUniqueInput, data: Prisma.GuildUpdateInput): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    async delete(where: Prisma.GuildWhereUniqueInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
