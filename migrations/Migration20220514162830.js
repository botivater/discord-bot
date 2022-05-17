"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220514162830 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220514162830 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` drop index `guild_member_uid_guild_id_unique`;');
        this.addSql('alter table `guild_member` change `uid` `snowflake` varchar(64) not null;');
        this.addSql('alter table `guild_member` add unique `guild_member_snowflake_guild_id_unique`(`snowflake`, `guild_id`);');
    }
    async down() {
        this.addSql('alter table `guild_member` drop index `guild_member_snowflake_guild_id_unique`;');
        this.addSql('alter table `guild_member` change `snowflake` `uid` varchar(64) not null;');
        this.addSql('alter table `guild_member` add unique `guild_member_uid_guild_id_unique`(`uid`, `guild_id`);');
    }
}
exports.Migration20220514162830 = Migration20220514162830;
