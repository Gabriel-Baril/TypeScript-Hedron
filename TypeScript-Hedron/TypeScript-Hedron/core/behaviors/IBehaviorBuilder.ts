namespace Hedron {
    export interface IBehaviorBuilder {
        readonly type: string;
        buildFromJson(json: any): IBehavior;
    }
}