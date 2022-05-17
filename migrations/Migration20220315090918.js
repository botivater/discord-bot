"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220315090918 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220315090918 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` add `last_interaction` datetime null;');
    }
    async down() {
        this.addSql('alter table `guild_member` drop `last_interaction`;');
    }
}
exports.Migration20220315090918 = Migration20220315090918;
