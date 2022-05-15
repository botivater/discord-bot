import { Migration } from '@mikro-orm/migrations';

export class Migration20220514185333 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` drop foreign key `guild_member_guild_id_foreign`;');

    this.addSql('alter table `guild_member` modify `guild_id` int unsigned null;');
    this.addSql('alter table `guild_member` add constraint `guild_member_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop foreign key `guild_member_guild_id_foreign`;');

    this.addSql('alter table `guild_member` modify `guild_id` int unsigned not null;');
    this.addSql('alter table `guild_member` add constraint `guild_member_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete no action;');
  }

}
