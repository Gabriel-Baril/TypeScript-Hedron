namespace Hedron {
    export interface IcomponentBuilder {
        readonly type: string;

        buildFromJson(json: any): IComponent;
    }
}