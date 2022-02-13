import { Migration } from '@mikro-orm/migrations';

export class Migration20220213154618 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow_group` modify `reactions` varchar(255);');

    this.addSql('alter table `guild_member` drop index `guildMember_uid_guild_id_unique`;');
  }

}
