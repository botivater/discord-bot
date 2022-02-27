import { Migration } from '@mikro-orm/migrations';

export class Migration20220227165830 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` drop foreign key `guildMember_guild_id_foreign`;');

    this.addSql('alter table `command_flow_group` drop foreign key `command_flow_group_guild_id_foreign`;');

    this.addSql('alter table `command_flow` drop foreign key `command_flow_command_flow_group_id_foreign`;');

    this.addSql('alter table `command_list` modify `options` text not null;');

    this.addSql('alter table `guild_member` drop index `guild_member_uid_guild_id_unique`;');
    this.addSql('alter table `guild_member` add constraint `guild_member_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');
    this.addSql('alter table `guild_member` add index `guild_member_guild_id_index`(`guild_id`);');
    this.addSql('alter table `guild_member` add unique `guild_member_uid_guild_id_unique`(`uid`, `guild_id`);');

    this.addSql('alter table `command_flow_group` add constraint `command_flow_group_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');

    this.addSql('alter table `command_flow` modify `building_block_type` tinyint not null, modify `check_type` tinyint, modify `on_type` tinyint not null;');
    this.addSql('alter table `command_flow` add constraint `command_flow_command_flow_group_id_foreign` foreign key (`command_flow_group_id`) references `command_flow_group` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `command_flow` drop foreign key `command_flow_command_flow_group_id_foreign`;');

    this.addSql('alter table `command_flow_group` drop foreign key `command_flow_group_guild_id_foreign`;');

    this.addSql('alter table `guild_member` drop foreign key `guild_member_guild_id_foreign`;');

    this.addSql('alter table `command_flow` modify `on_type` int not null, modify `building_block_type` int not null, modify `check_type` int;');
    this.addSql('alter table `command_flow` add constraint `command_flow_command_flow_group_id_foreign` foreign key (`command_flow_group_id`) references `command_flow_group` (`id`) on update cascade on delete no action;');

    this.addSql('alter table `command_flow_group` add constraint `command_flow_group_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete no action;');

    this.addSql('alter table `command_list` modify `options` json not null;');

    this.addSql('alter table `guild_member` drop index `guild_member_guild_id_index`;');
    this.addSql('alter table `guild_member` drop index `guild_member_uid_guild_id_unique`;');
    this.addSql('alter table `guild_member` add constraint `guildMember_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete no action;');
    this.addSql('alter table `guild_member` add index `guild_member_uid_guild_id_unique`(`guild_id`);');
  }

}
