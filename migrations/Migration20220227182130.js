"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220227182130 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220227182130 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_list` modify `options` json not null;');
    }
    async down() {
        this.addSql('alter table `command_list` modify `options` text not null;');
    }
}
exports.Migration20220227182130 = Migration20220227182130;
