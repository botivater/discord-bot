import { GuildConfig, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../error/NotFoundError";
import { IService } from "../IService";

export class GuildConfigNotFound extends NotFoundError {};
export class GuildConfigNotCreated extends Error {};

export class GuildConfigServiceV2 implements IService<GuildConfig> {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findAll(): Promise<GuildConfig[]> {
        return this.prisma.guildConfig.findMany();
    }

    async findOne(where: Prisma.GuildConfigWhereUniqueInput): Promise<GuildConfig> {
        const guildConfig = await this.prisma.guildConfig.findUnique({
            where
        });
        if (!guildConfig) throw new GuildConfigNotFound(String(where.id));

        return guildConfig;
    }

    async create(data: Prisma.GuildConfigCreateInput): Promise<GuildConfig> {
        const guildConfig = await this.prisma.guildConfig.create({
            data
        });
        if (!guildConfig) throw new GuildConfigNotCreated();

        return guildConfig;
    }

    async update(where: Prisma.GuildConfigWhereUniqueInput, data: Prisma.GuildConfigUpdateInput): Promise<GuildConfig> {
        const guildConfig = await this.prisma.guildConfig.findUnique({
            where
        });
        if (!guildConfig) throw new GuildConfigNotFound(String(where.id));

        const updatedGuildConfig = await this.prisma.guildConfig.update({
            where,
            data
        });

        return updatedGuildConfig;
    }

    async delete(where: Prisma.GuildConfigWhereUniqueInput): Promise<void> {
        const guildConfig = await this.prisma.guildConfig.findUnique({
            where
        });
        if (!guildConfig) throw new GuildConfigNotFound(String(where.id));

        await this.prisma.guildConfig.delete({
            where
        });
    }
}
