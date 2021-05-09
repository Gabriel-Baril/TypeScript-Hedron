/// <reference path="componentmanager.ts" />

namespace Hedron {

    // Extract sprite component informations fron json file
    export class SpriteComponentData implements IComponentData {
        public name: string;
        public materialName: string;

        public setFromJson(json: any) {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.materialName !== undefined) {
                this.materialName = String(json.materialName);
            }
        }
    }

    // Build a SpriteComponent from a json
    export class SpriteComponentBuilder implements IComponentBuilder {
        buildFromJson(json: any): IComponent {
            const data = new SpriteComponentData();
            data.setFromJson(json);
            return new SpriteComponent(data);
        }

        public get type(): string {
            return "sprite";
        }
    }

    export class SpriteComponent extends BaseComponent {
        private _sprite: Sprite;

        public constructor(data: SpriteComponentData) {
            super(data);

            this._sprite = new Sprite(data.name, data.materialName);
        }

        public load(): void {
            this._sprite.load();
        }

        public render(shader: Shader): void {
            this._sprite.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }

    ComponentManager.registerBuilder(new SpriteComponentBuilder());
}