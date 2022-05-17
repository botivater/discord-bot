"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220227201728 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220227201728 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` add `birthday` date null;');
    }
    async down() {
        this.addSql('alter table `guild_member` drop `birthday`;');
    }
}
exports.Migration20220227201728 = Migration20220227201728;
