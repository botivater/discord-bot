"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220323200922 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220323200922 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` add `identifier` varchar(255) null;');
    }
    async down() {
        this.addSql('alter table `guild_member` drop `identifier`;');
    }
}
exports.Migration20220323200922 = Migration20220323200922;
