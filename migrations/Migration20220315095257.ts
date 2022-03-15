import { Migration } from '@mikro-orm/migrations';

export class Migration20220315095257 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` add `active` tinyint(1) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop `active`;');
  }

}
