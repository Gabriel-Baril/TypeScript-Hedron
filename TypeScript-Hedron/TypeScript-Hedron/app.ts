namespace Hedron {
    export class Engine {
        private _frameCount: number;

        public constructor() {
            this._frameCount = 0;
        }

        public init(): void {

            this.loop();
        }

        private loop(): void {
            this._frameCount++;
            document.title = this._frameCount.toString();

            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        }
    }
}

window.onload = function () {
    const engine = new Hedron.Engine();
    engine.init();
}

