import { Migration } from '@mikro-orm/migrations';

export class Migration20220128102908 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `command_flow` add `on_type` int(11) not null;');
  }

}
