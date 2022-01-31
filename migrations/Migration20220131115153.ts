import { Migration } from '@mikro-orm/migrations';

export class Migration20220131115153 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow_group` add `channel_id` varchar(255) not null, add `message_text` varchar(255) not null, add `reactions` json not null;');
  }

}
