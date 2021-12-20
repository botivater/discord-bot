import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("guilds", function (table: Knex.CreateTableBuilder) {
        table.increments("id");
        table.timestamps(true, true);
        table.string("uid", 64).notNullable().index().unique().comment("Guild snowflake ID");
        table.string("name", 100).notNullable().comment("Guild name");
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("guilds");
}

