"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220226202504 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220226202504 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow_group` modify `reactions` varchar(255) not null;');
        this.addSql('alter table `command_flow_group` modify `message_text` text not null;');
    }
}
exports.Migration20220226202504 = Migration20220226202504;
