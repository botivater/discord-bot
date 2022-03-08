import { Migration } from '@mikro-orm/migrations';

export class Migration20220308001023 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `report` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `guild_member_id` int unsigned null, `channel_id` varchar(255) null, `description` text null, `user_id` int unsigned null, `anonymous` tinyint(1) not null, `resolved` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `report` add index `report_guild_member_id_index`(`guild_member_id`);');
    this.addSql('alter table `report` add index `report_user_id_index`(`user_id`);');

    this.addSql('alter table `report` add constraint `report_guild_member_id_foreign` foreign key (`guild_member_id`) references `guild_member` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `report` add constraint `report_user_id_foreign` foreign key (`user_id`) references `guild_member` (`id`) on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `report`;');
  }

}
