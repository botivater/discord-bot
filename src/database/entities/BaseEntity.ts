import { DateType, PrimaryKey, Property, TimeType } from "@mikro-orm/core";

export abstract class BaseEntity {
    @PrimaryKey()
    id!: number;

    @Property({ type: Date, nullable: false })
    createdAt = new Date();

    @Property({ type: Date, nullable: false, onUpdate: () => new Date() })
    updatedAt = new Date();
}
