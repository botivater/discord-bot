import { Migration } from '@mikro-orm/migrations';

export class Migration20220127113754 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guildMember` rename to `guild_member`;');
  }

}
