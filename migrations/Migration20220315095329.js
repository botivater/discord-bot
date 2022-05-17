"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220315095329 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220315095329 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` modify `active` tinyint(1) not null default true;');
    }
}
exports.Migration20220315095329 = Migration20220315095329;
