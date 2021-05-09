namespace Hedron {
    /**
     * The main game engine class
     * */
    export class Engine {
        private _frameCount: number;

        private _canvas: HTMLCanvasElement;
        private _basicShader: BasicShader;

        private _projection: Matrix4x4;


        public constructor() {
            this._frameCount = 0;
        }

        public start(): void {
            this._canvas = GLUtilities.init("main-context");
            AssetManager.init();

            gl.clearColor(0, 0, 0, 1);

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // Load materials
            MaterialManager.registerMaterial(new Material("cricket", "assets/textures/collectibles_004_cricketshead.png", new Color(255, 128, 0, 255)));

            this.resize();

            let zoneID = ZoneManager.createTestZone();
            ZoneManager.setActiveZone(zoneID);

            this.loop();
        }

        /**
         * Resize callback function
         * */
        public resize(): void {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth; // Represent the width of the page of our client
                this._canvas.height = window.innerHeight; // Represent the height of the page of our client

                gl.viewport(0, 0, this._canvas.width, this._canvas.height);
                this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100, 100);
            }
        }

        private loop(): void {
            this._frameCount++;
            MessageBus.update(0);
            ZoneManager.update(0);

            gl.clear(gl.COLOR_BUFFER_BIT);

            ZoneManager.render(this._basicShader);

            // Set uniforms
            //gl.uniform4f(colorPosition, 1, 1, 1, 1);

            const projectionPosition = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        }
    }
}