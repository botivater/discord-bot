import { GuildMember, Prisma } from "@prisma/client";

export interface IGuildMemberService {
    findAll(where: Prisma.GuildMemberWhereInput): Promise<GuildMember[]>;
    findOne(where: Prisma.GuildMemberWhereUniqueInput): Promise<GuildMember>;
    create(data: Prisma.GuildMemberCreateInput): Promise<GuildMember>;
    update(where: Prisma.GuildMemberWhereUniqueInput, data: Prisma.GuildMemberUpdateInput): Promise<GuildMember>;
    delete(where: Prisma.GuildMemberWhereUniqueInput): Promise<void>;
}