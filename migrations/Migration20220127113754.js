"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220127113754 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220127113754 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guildMember` rename to `guild_member`;');
    }
}
exports.Migration20220127113754 = Migration20220127113754;
