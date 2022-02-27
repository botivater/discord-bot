import { Migration } from '@mikro-orm/migrations';

export class Migration20220227201728 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` add `birthday` date null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop `birthday`;');
  }

}
