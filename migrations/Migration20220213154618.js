"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220213154618 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220213154618 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `command_flow_group` modify `reactions` varchar(255);');
        this.addSql('alter table `guild_member` drop index `guildMember_uid_guild_id_unique`;');
    }
}
exports.Migration20220213154618 = Migration20220213154618;
