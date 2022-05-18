import { PrismaClient } from "@prisma/client";
import database from "../../database";

class GuildMemberService {
    private prisma: PrismaClient;

    /**
     *
     */
    constructor() {
        this.prisma = database.getPrisma();
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

export default new GuildMemberService();
