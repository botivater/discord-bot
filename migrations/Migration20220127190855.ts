import { Migration } from '@mikro-orm/migrations';

export class Migration20220127190855 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` rename index `guildMember_guild_id_index` to `guild_member_uid_guild_id_unique`;');
  }

}
