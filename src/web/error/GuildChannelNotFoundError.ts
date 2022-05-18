export default class GuildChannelNotFoundError extends Error {
    constructor(id?: string) {
        super();
        this.name = "Guild channel not found";
        this.message = id
            ? `No guild channel was found with ID: ${id}`
            : "No guild channel was found with that filter.";
    }
}
