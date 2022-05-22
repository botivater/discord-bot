import { Guild, Prisma } from "@prisma/client";

export interface IGuildService {
    findAll(where: Prisma.GuildWhereInput): Promise<Guild[]>;
    findOne(where: Prisma.GuildWhereUniqueInput): Promise<Guild>;
    create(data: Prisma.GuildCreateInput): Promise<Guild>;
    update(where: Prisma.GuildWhereUniqueInput, data: Prisma.GuildUpdateInput): Promise<Guild>;
    delete(where: Prisma.GuildWhereUniqueInput): Promise<void>;
}