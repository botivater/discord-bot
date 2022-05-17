"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220315095257 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220315095257 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` add `active` tinyint(1) not null;');
    }
    async down() {
        this.addSql('alter table `guild_member` drop `active`;');
    }
}
exports.Migration20220315095257 = Migration20220315095257;
