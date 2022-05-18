import { Guild, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../error/NotFoundError";
import { IService } from "../IService";

export class GuildNotFound extends NotFoundError {};
export class GuildNotCreated extends Error {};

export class GuildServiceV2 implements IService<Guild> {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(): Promise<Guild[]> {
        return this.prisma.guild.findMany();
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

    async update(where: Prisma.GuildWhereUniqueInput, data: Prisma.GuildCreateInput): Promise<Guild> {
        throw new Error("Method not implemented.");
    }

    async delete(where: Prisma.GuildWhereUniqueInput): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
