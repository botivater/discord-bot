import database from "@/database";
import { GuildMemberEntity } from "@/database/entities/GuildMemberEntity";
import { EntityRepository } from "@mikro-orm/mysql";

class GuildMemberService {
    private getGuildMemberRepository(): EntityRepository<GuildMemberEntity> {
        return database.getORM().em.fork().getRepository(GuildMemberEntity);
    }

    public async getAllGuildMembers() {
        const guildMemberRepository = this.getGuildMemberRepository();

        return guildMemberRepository.find({});
    }

    public async getGuildMember(data: { id: number }) {
        const guildMemberRepository = this.getGuildMemberRepository();

        const { id } = data;

        return guildMemberRepository.findOne(id);
    }
}

export default new GuildMemberService();
