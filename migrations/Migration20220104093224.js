"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220104093224 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220104093224 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guildMember` add unique `guildMember_uid_guild_id_unique`(`uid`, `guild_id`);');
    }
}
exports.Migration20220104093224 = Migration20220104093224;
