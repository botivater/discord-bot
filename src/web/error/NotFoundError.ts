export class NotFoundError extends Error {
    /**
     * Construct a new NotFoundError with an identifier for tracing back the issue.
     */
    constructor(identifier: string) {
        super(`Identifier: ${identifier}`);
    }
}