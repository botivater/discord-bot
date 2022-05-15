import { Migration } from '@mikro-orm/migrations';

export class Migration20220514162830 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` drop index `guild_member_uid_guild_id_unique`;');
    this.addSql('alter table `guild_member` change `uid` `snowflake` varchar(64) not null;');
    this.addSql('alter table `guild_member` add unique `guild_member_snowflake_guild_id_unique`(`snowflake`, `guild_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop index `guild_member_snowflake_guild_id_unique`;');
    this.addSql('alter table `guild_member` change `snowflake` `uid` varchar(64) not null;');
    this.addSql('alter table `guild_member` add unique `guild_member_uid_guild_id_unique`(`uid`, `guild_id`);');
  }

}
