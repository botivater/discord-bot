import { Migration } from '@mikro-orm/migrations';

export class Migration20220315095329 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild_member` modify `active` tinyint(1) not null default true;');
  }

}
