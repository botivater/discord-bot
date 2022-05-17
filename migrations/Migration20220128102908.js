"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220128102908 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220128102908 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow` add `on_type` int(11) not null;');
    }
}
exports.Migration20220128102908 = Migration20220128102908;
