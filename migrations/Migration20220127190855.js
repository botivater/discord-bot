"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220127190855 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220127190855 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` rename index `guildMember_guild_id_index` to `guild_member_uid_guild_id_unique`;');
    }
}
exports.Migration20220127190855 = Migration20220127190855;
