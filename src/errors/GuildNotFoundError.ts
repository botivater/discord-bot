export default class GuildNotFoundError extends Error {
    constructor(id?: string) {
        super();
        this.name = "Guild not found";
        this.message = id
            ? `No guild was found with ID: ${id}`
            : "No guild was found with that filter.";
    }
}
