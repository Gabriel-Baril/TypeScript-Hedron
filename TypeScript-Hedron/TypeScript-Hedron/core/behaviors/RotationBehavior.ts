/// <reference path="behaviormanager.ts" />
/// <reference path="basebehavior.ts" />
namespace Hedron {

    export class RotationBehaviorData implements IBehaviorData {
        public name: string;
        public rotation: Vec3 = Vec3.zero;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in behavior data.")
            }

            this.name = String(json.name);

            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
            }
        }
    }

    export class RotationBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "rotation";
        }

        public buildFromJson(json: any): IBehavior {
            const data = new RotationBehaviorData();
            data.setFromJson(json);
            return new RotationBehavior(data);
        }
    }

    export class RotationBehavior extends BaseBehavior {
        public name: string;

        private _rotation: Vec3;

        public constructor(data: RotationBehaviorData) {
            super(data);

            this._rotation = data.rotation;
        }

        public update(time: number): void {
            this._owner.transform.rotation.add(this._rotation);

            super.update(time);
        }
    }

    BehaviorManager.registerBuilder(new RotationBehaviorBuilder());
}