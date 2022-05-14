import { Migration } from '@mikro-orm/migrations';

export class Migration20220514153001 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild` drop index `guild_uid_unique`;');
    this.addSql('alter table `guild` change `uid` `snowflake` varchar(64) not null;');
    this.addSql('alter table `guild` add unique `guild_snowflake_unique`(`snowflake`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild` drop index `guild_snowflake_unique`;');
    this.addSql('alter table `guild` change `snowflake` `uid` varchar(64) not null;');
    this.addSql('alter table `guild` add unique `guild_uid_unique`(`uid`);');
  }

}
