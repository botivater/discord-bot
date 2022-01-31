import database from "@/database";
import { CommandListEntity } from "@/database/entities/CommandListEntity";
import { GuildEntity } from "@/database/entities/GuildEntity";
import GuildNotFoundError from "@/errors/GuildNotFoundError";
import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

class CommandListService {
    public async findAllListCommands() {
        const em = database.getORM().em.fork();
        return em.find(CommandListEntity, {});
    }

    public async findListCommand(data: { id: number }) {
        const em = database.getORM().em.fork();
        const { id } = data;

        const dbCommandList = await em.findOne(CommandListEntity, {
            id,
        });
        if (!dbCommandList) throw new Error("Not found error");

        return dbCommandList;
    }

    public async storeListCommand(data: {
        name: string;
        description: string;
        options: string[];
        guildId: number;
    }) {
        const em = database.getORM().em.fork();
        const { name, description, options, guildId } = data;

        const commandListEntity = new CommandListEntity(
            name,
            description,
            options
        );
        em.persist(commandListEntity);

        const dbGuild = await em.findOne(GuildEntity, { id: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        dbGuild.guildCommandLists.add(commandListEntity);

        await em.flush();

        return commandListEntity;
    }

    public async updateListCommand(
        find: {
            id: number;
        },
        data: { name: string; description: string; options: string[] }
    ) {
        const em = database.getORM().em.fork();
        const { id } = find;
        const { name, description, options } = data;

        const dbCommandList = await em.findOne(CommandListEntity, {
            id,
        });
        if (!dbCommandList) throw new Error("Not found error");

        dbCommandList.name = name;
        dbCommandList.description = description;
        dbCommandList.options = options;

        await em.flush();

        return dbCommandList;
    }

    public async deleteListCommand(data: { id: number }) {
        const em = database.getORM().em.fork();
        const { id } = data;

        const dbCommandList = await em.findOne(CommandListEntity, {
            id,
        });
        if (!dbCommandList) throw new Error("Not found error");

        dbCommandList.guilds.init();
        for (const dbGuild of dbCommandList.guilds) {
            dbGuild.guildCommandLists.remove(dbCommandList);
        }

        em.remove(dbCommandList);

        await em.flush();

        return null;
    }

    public async attachListCommandToGuild(data: {
        commandListId: number;
        guildId: number;
    }) {
        const em = database.getORM().em.fork();

        const { commandListId, guildId } = data;

        const dbCommandList = await em.findOne(CommandListEntity, {
            id: commandListId,
        });
        if (!dbCommandList) throw new Error("Not found error");

        const dbGuild = await em.findOne(GuildEntity, { id: guildId });
        if (!dbGuild) throw new GuildNotFoundError();

        dbGuild.guildCommandLists.add(dbCommandList);

        em.flush();
    }
}

export default new CommandListService();
