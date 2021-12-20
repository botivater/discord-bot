import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("guild_members", function (table: Knex.CreateTableBuilder) {
        table.increments("id");
        table.timestamps(true, true);

        table.integer("guild_id").unsigned().notNullable();
        // table.foreign("guild_id").references("id").inTable("guilds").onDelete("DELETE");
        table.foreign("guild_id").references("id").inTable("guilds");

        table.string("uid", 64).notNullable().index().unique().comment("Guild snowflake ID");
        table.string("name", 100).notNullable().comment("Guild name");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("guild_members");
}
