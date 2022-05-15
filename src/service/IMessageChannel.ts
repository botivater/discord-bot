export interface IMessageChannel {
    send(message: string): void|Promise<void>;
}