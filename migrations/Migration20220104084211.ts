import { Migration } from '@mikro-orm/migrations';

export class Migration20220104084211 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guildMember` drop index `guildMember_uid_unique`;');
  }

}
