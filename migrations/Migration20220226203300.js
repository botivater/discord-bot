"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220226203300 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220226203300 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow_group` modify `reactions` text not null;');
    }
}
exports.Migration20220226203300 = Migration20220226203300;
