import { GuildConfig, Prisma } from "@prisma/client";

export interface IGuildConfigService {
    findAll(where: Prisma.GuildConfigWhereInput): Promise<GuildConfig[]>;
    findOne(where: Prisma.GuildConfigWhereUniqueInput): Promise<GuildConfig>;
    create(data: Prisma.GuildConfigCreateInput): Promise<GuildConfig>;
    update(where: Prisma.GuildConfigWhereUniqueInput, data: Prisma.GuildConfigUpdateInput): Promise<GuildConfig>;
    delete(where: Prisma.GuildConfigWhereUniqueInput): Promise<void>;
}