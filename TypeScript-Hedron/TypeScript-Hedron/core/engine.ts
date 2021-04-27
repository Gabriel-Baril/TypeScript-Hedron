namespace Hedron {
    /**
     * The main game engine class
     * */
    export class Engine {
        private _frameCount: number;

        private _canvas: HTMLCanvasElement;
        private _shader: Shader;

        private _sprite: Sprite;
        private _projection: Matrix4x4;


        public constructor() {
            this._frameCount = 0;
        }

        public start(): void {
            this._canvas = GLUtilities.init("main-context");
            AssetManager.init();
            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.use();

            this._sprite = new Sprite("test", "assets/textures/collectibles_004_cricketshead.png");
            this._sprite.position = new Vec3(300, 200, 0);
            this._sprite.load();

            this.resize();

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
                this._projection = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100, 100);
            }
        }

        private loop(): void {
            this._frameCount++;
            MessageBus.update(0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Set uniforms
            const colorPosition = this._shader.getUniformLocation("u_tintColor");
             gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            //gl.uniform4f(colorPosition, 1, 1, 1, 1);

            const projectionPosition = this._shader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

            const modelPosition = this._shader.getUniformLocation("u_model");
            const translationMat = Matrix4x4.translation(this._sprite.position);
            gl.uniformMatrix4fv(modelPosition, false, new Float32Array(translationMat.data));

            this._sprite.draw(this._shader);

            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        }

        private loadShaders(): void {
            const vertexShaderSource: string = `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projection;
uniform mat4 u_model;

varying vec2 v_texCoord;

void main() {
    gl_Position = u_projection * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
}`;
            const fragmentShaderSource: string = `
precision mediump float;

uniform vec4 u_tintColor;
uniform sampler2D u_diffuse;

varying vec2 v_texCoord;

void main() {
    gl_FragColor = u_tintColor * texture2D(u_diffuse, v_texCoord);
}
`;
            this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);

        }
    }
}