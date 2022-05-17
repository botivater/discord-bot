"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220104084211 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220104084211 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guildMember` drop index `guildMember_uid_unique`;');
    }
}
exports.Migration20220104084211 = Migration20220104084211;
