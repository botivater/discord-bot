import { Migration } from '@mikro-orm/migrations';

export class Migration20220128101953 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow` add `check_type` int(11) null, add `check_value` varchar(255) null;');
  }

}
