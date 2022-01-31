import { Migration } from '@mikro-orm/migrations';

export class Migration20220131113705 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `command_flow_group` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `guild_id` int(11) unsigned not null, `name` varchar(255) not null, `description` varchar(255) not null, `type` tinyint not null, `message_id` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `command_flow_group` add index `command_flow_group_guild_id_index`(`guild_id`);');

    this.addSql('alter table `command_flow` add `command_flow_group_id` int(11) unsigned not null;');
    this.addSql('alter table `command_flow` add index `command_flow_command_flow_group_id_index`(`command_flow_group_id`);');
    this.addSql('alter table `command_flow` drop foreign key `command_flow_guild_id_foreign`;');
    this.addSql('alter table `command_flow` drop index `command_flow_guild_id_index`;');
    this.addSql('alter table `command_flow` drop `guild_id`;');
    this.addSql('alter table `command_flow` drop `message_id`;');

    this.addSql('alter table `command_flow_group` add constraint `command_flow_group_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');

    this.addSql('alter table `command_flow` add constraint `command_flow_command_flow_group_id_foreign` foreign key (`command_flow_group_id`) references `command_flow_group` (`id`) on update cascade;');
  }

}
