namespace Hedron {
    /**
     * The main game engine class
     * */
    export class Engine {
        private _frameCount: number;
        private _canvas: HTMLCanvasElement;
        private _shader: Shader;

        private _buffer: GLBuffer; // A container of data to be pushed to the graphics card

        public constructor() {
            this._frameCount = 0;
        }

        public start(): void {
            this._canvas = GLUtilities.init("main-context");
            gl.clearColor(0, 0, 0, 1);

            this.loadShaders();
            this._shader.use();

            this.createBuffer();

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
            }
        }

        private loop(): void {
            this._frameCount++;
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Set uniforms
            const colorPosition = this._shader.getUniformLocation("u_color");
            gl.uniform4f(colorPosition, 1, 0.5, 0, 1);

            this._buffer.bind();
            this._buffer.draw();

            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        }

        private createBuffer(): void {
            this._buffer = new GLBuffer(3);

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = this._shader.getAttributeLocation("a_position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttribute(positionAttribute);

            const vertices = [
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0, 0,
                0, 0, 0,
            ]

            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }

        private loadShaders(): void {
            const vertexShaderSource: string = `
attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1.0);
}`;
            const fragmentShaderSource: string = `
precision mediump float;

uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}
`
            this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);

        }
    }
}