export class DiscordEntityError extends Error {
    /**
     * @param snowflake Snowflake of the entity.
     */
    constructor(snowflake: string) {
        super(`Snowflake: ${snowflake}`);
    }
}