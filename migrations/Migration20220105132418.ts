import { Migration } from '@mikro-orm/migrations';

export class Migration20220105132418 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `command_invocation` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `guild_id` int(11) unsigned null, `guild_member_id` int(11) unsigned null, `command_name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `command_invocation` add index `command_invocation_guild_id_index`(`guild_id`);');
    this.addSql('alter table `command_invocation` add index `command_invocation_guild_member_id_index`(`guild_member_id`);');

    this.addSql('alter table `command_invocation` add constraint `command_invocation_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `command_invocation` add constraint `command_invocation_guild_member_id_foreign` foreign key (`guild_member_id`) references `guildMember` (`id`) on update cascade on delete set null;');
  }

}