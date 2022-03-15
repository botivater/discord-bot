import { Migration } from '@mikro-orm/migrations';

export class Migration20220315090918 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` add `last_interaction` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop `last_interaction`;');
  }

}
