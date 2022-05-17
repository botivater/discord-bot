"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220514153001 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220514153001 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild` drop index `guild_uid_unique`;');
        this.addSql('alter table `guild` change `uid` `snowflake` varchar(64) not null;');
        this.addSql('alter table `guild` add unique `guild_snowflake_unique`(`snowflake`);');
    }
    async down() {
        this.addSql('alter table `guild` drop index `guild_snowflake_unique`;');
        this.addSql('alter table `guild` change `snowflake` `uid` varchar(64) not null;');
        this.addSql('alter table `guild` add unique `guild_uid_unique`(`uid`);');
    }
}
exports.Migration20220514153001 = Migration20220514153001;
