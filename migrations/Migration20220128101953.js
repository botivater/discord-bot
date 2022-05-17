"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220128101953 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220128101953 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow` add `check_type` int(11) null, add `check_value` varchar(255) null;');
    }
}
exports.Migration20220128101953 = Migration20220128101953;
