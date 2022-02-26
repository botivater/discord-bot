import { Migration } from '@mikro-orm/migrations';

export class Migration20220226202504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow_group` modify `reactions` varchar(255) not null;');
    this.addSql('alter table `command_flow_group` modify `message_text` text not null;');
  }

}
