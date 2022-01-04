import database from "@/database";
import { CommandListEntity } from "@/database/entities/CommandListEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import GuildNotFoundError from "@/errors/GuildNotFoundError";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

class CommandListService {
    protected em: EntityManager<IDatabaseDriver<Connection>> | undefined =
        undefined;

    public async findAllListCommands() {
        if (!this.em) this.em = database.getORM().em;
        return this.em.find(CommandListEntity, {});
    }

    public async storeListCommands(data: {
        name: string;
        description: string;
        options: string[];
        guildId: number;
    }) {
        if (!this.em) this.em = database.getORM().em;
        const { name, description, options, guildId } = data;

        const commandListEntity = new CommandListEntity(
            name,
            description,
            options
        );
        this.em.persist(commandListEntity);

        const dbGuild = await this.em.findOne(GuildEntity, { id: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        dbGuild.guildCommandLists.add(commandListEntity);

        await this.em.flush();

        return commandListEntity;
    }

    public async deleteListCommands(data: {
        id: number
    }) {
        if (!this.em) this.em = database.getORM().em;
        const { id } = data;

        const dbCommandList = await this.em.findOne(CommandListEntity, {
            id,
        });
        if (!dbCommandList) throw new Error("Not found error");

        dbCommandList.guilds.init();
        for (const dbGuild of dbCommandList.guilds) {
            dbGuild.guildCommandLists.remove(dbCommandList);
        }

        this.em.remove(dbCommandList);

        await this.em.flush();

        return null;
    }

    public async attachListCommandToGuild(data: {
        commandListId: number;
        guildId: number;
    }) {
        if (!this.em) this.em = database.getORM().em;

        const { commandListId, guildId } = data;

        const dbCommandList = await this.em.findOne(CommandListEntity, {
            id: commandListId,
        });
        if (!dbCommandList) throw new Error("Not found error");

        const dbGuild = await this.em.findOne(GuildEntity, { id: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        dbGuild.guildCommandLists.add(dbCommandList);

        this.em.flush();
    }
}

export default new CommandListService();
