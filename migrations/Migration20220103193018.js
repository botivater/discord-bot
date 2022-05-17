"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220103193018 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220103193018 extends migrations_1.Migration {
    async up() {
        this.addSql('create table `guild` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `uid` varchar(64) not null, `name` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
        this.addSql('alter table `guild` add unique `guild_uid_unique`(`uid`);');
        this.addSql('create table `guildMember` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `uid` varchar(64) not null, `name` varchar(255) null, `guild_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
        this.addSql('alter table `guildMember` add unique `guildMember_uid_unique`(`uid`);');
        this.addSql('alter table `guildMember` add index `guildMember_guild_id_index`(`guild_id`);');
        this.addSql('alter table `guildMember` add constraint `guildMember_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');
    }
}
exports.Migration20220103193018 = Migration20220103193018;
