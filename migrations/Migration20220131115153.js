"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220131115153 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220131115153 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow_group` add `channel_id` varchar(255) not null, add `message_text` varchar(255) not null, add `reactions` json not null;');
    }
}
exports.Migration20220131115153 = Migration20220131115153;
