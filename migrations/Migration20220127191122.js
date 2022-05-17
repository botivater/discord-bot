"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220127191122 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220127191122 extends migrations_1.Migration {
    async up() {
        this.addSql('create table `command_flow` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `guild_id` int(11) unsigned not null, `message_id` varchar(255) not null, `building_block_type` int(11) not null, `options` varchar(255) not null, `order` int(11) not null) default character set utf8mb4 engine = InnoDB;');
        this.addSql('alter table `command_flow` add index `command_flow_guild_id_index`(`guild_id`);');
        this.addSql('alter table `command_flow` add constraint `command_flow_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');
    }
}
exports.Migration20220127191122 = Migration20220127191122;
