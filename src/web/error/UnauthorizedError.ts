export class UnauthorizedError extends Error {
    /**
     *
     */
    constructor() {
        super();
        this.name = "Unauthorized";
        this.message = "You do not have permission to access this object.";
    }
}
