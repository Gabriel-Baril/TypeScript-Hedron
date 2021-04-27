namespace Hedron {
    export interface IMessageHandler {
        onMessage(message: Message): void;
    }
}