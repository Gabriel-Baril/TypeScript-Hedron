namespace Hedron {
    /**
     * The main game engine class
     * */
    export class Engine {
        private _frameCount: number;
        private _canvas: HTMLCanvasElement;

        public constructor() {
            this._frameCount = 0;
        }

        public start(): void {
            this._canvas = GLUtilities.init("main-context");
            gl.clearColor(0, 0, 0, 1);

            this.loop();
        }

        private loop(): void {
            this._frameCount++;
            gl.clear(gl.COLOR_BUFFER_BIT);

            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        }
    }
}