import { Migration } from '@mikro-orm/migrations';

export class Migration20220227182130 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_list` modify `options` json not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `command_list` modify `options` text not null;');
  }

}
