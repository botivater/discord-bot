import { Migration } from '@mikro-orm/migrations';

export class Migration20220104100740 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `command_list` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null, `description` varchar(255) not null, `options` json not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `command_list` add unique `command_list_name_unique`(`name`);');

    this.addSql('create table `guild_guild_command_lists` (`guild_entity_id` int(11) unsigned not null, `command_list_entity_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `guild_guild_command_lists` add index `guild_guild_command_lists_guild_entity_id_index`(`guild_entity_id`);');
    this.addSql('alter table `guild_guild_command_lists` add index `guild_guild_command_lists_command_list_entity_id_index`(`command_list_entity_id`);');
    this.addSql('alter table `guild_guild_command_lists` add primary key `guild_guild_command_lists_pkey`(`guild_entity_id`, `command_list_entity_id`);');

    this.addSql('alter table `guild_guild_command_lists` add constraint `guild_guild_command_lists_guild_entity_id_foreign` foreign key (`guild_entity_id`) references `guild` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `guild_guild_command_lists` add constraint `guild_guild_command_lists_command_list_entity_id_foreign` foreign key (`command_list_entity_id`) references `command_list` (`id`) on update cascade on delete cascade;');
  }

}
