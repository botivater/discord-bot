import { Migration } from '@mikro-orm/migrations';

export class Migration20220226203300 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow_group` modify `reactions` text not null;');
  }

}
