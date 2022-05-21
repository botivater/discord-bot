import { PrismaClient } from "@prisma/client";

export class GuildMemberService {
    private prisma: PrismaClient;

    /**
     * @param prisma Inject an instance of PrismaClient.
     */
     constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getAllGuildMembers() {
        return this.prisma.guildMember.findMany();
    }

    public async getGuildMember(data: { id: number }) {
        const { id } = data;

        return this.prisma.guildMember.findFirst({
            where: {
                id: {
                    equals: id
                }
            }
        });
    }
}
