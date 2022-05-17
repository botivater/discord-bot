"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220515093046 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220515093046 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table `guild_member` drop foreign key `guild_member_guild_id_foreign`;');
        this.addSql('alter table `guild_member` modify `guild_id` int unsigned not null;');
        this.addSql('alter table `guild_member` add constraint `guild_member_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade;');
    }
    async down() {
        this.addSql('alter table `guild_member` drop foreign key `guild_member_guild_id_foreign`;');
        this.addSql('alter table `guild_member` modify `guild_id` int unsigned null;');
        this.addSql('alter table `guild_member` add constraint `guild_member_guild_id_foreign` foreign key (`guild_id`) references `guild` (`id`) on update cascade on delete cascade;');
    }
}
exports.Migration20220515093046 = Migration20220515093046;
