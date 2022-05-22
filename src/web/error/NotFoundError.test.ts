import { NotFoundError } from "./NotFoundError";

test('NotFoundError constructs', () => {
    const notFoundError = new NotFoundError("1234");

    expect(notFoundError).toBeInstanceOf(NotFoundError);
});

test('NotFoundError sets error title', () => {
    expect(() => { throw new NotFoundError("1234") }).toThrow("Identifier: 1234");
});
