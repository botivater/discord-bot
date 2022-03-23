import { Migration } from '@mikro-orm/migrations';

export class Migration20220323200922 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` add `identifier` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `guild_member` drop `identifier`;');
  }

}
