import { Migration } from '@mikro-orm/migrations';

export class Migration20220104093224 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guildMember` add unique `guildMember_uid_guild_id_unique`(`uid`, `guild_id`);');
  }

}
