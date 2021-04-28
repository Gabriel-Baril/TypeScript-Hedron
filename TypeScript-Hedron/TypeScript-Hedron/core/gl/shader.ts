namespace Hedron {

    /**
     * Represent a WebGL shader
     * */
    export abstract class Shader {
        private _name: string;
        private _program: WebGLProgram;
        private _attributes: { [name: string]: number } = {};
        private _uniforms: { [name: string]: WebGLUniformLocation } = {};

        /**
         * Creates a new shader
         * @param name The name of this shader
         */
        public constructor(name: string) {
            this._name = name;
        }

        /**
         * The name of the shader
         */
        public get name(): string {
            return this._name;
        }

        /**
         * Use this shader
         * */
        public use(): void {
            gl.useProgram(this._program);
        }

        /**
         * Gets the location of an attribute
         * @param name
         */
        public getAttributeLocation(name: string): number {
            if (this._attributes[name] === undefined) {
                throw new Error(`Unable to find attribute named: '${name}' in shader named '${this._name}'`);
            }
            return this._attributes[name];
        }

        /**
         * Gets the location of an uniform
         * @param name
         */
        public getUniformLocation(name: string): WebGLUniformLocation {
            if (this._uniforms[name] === undefined) {
                throw new Error(`Unable to find uniform named: '${name}' in shader named '${this._name}'`);
            }
            return this._uniforms[name];
        }

        protected load(vertexSource: string, fragmentSource: string): void {
            const vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            const fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            this.createProgram(vertexShader, fragmentShader);

            this.detectAttributes();
            this.detectUniforms();
        }

        private loadShader(source: string, shaderType: number): WebGLShader {
            const shader: WebGLShader = gl.createShader(shaderType);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            const errorLog: string = gl.getShaderInfoLog(shader);
            if (errorLog !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + errorLog);
            }

            return shader;
        }

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader,): void {
            this._program = gl.createProgram();
            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);

            gl.linkProgram(this._program);

            let errorLog = gl.getProgramInfoLog(this._program);
            if (errorLog !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + errorLog);
            }
        }

        private detectAttributes(): void {
            const attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < attributeCount; i++) {
                const attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }

                this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
            }
        }

        private detectUniforms() {
            const uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) {
                const uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }

                this._uniforms[uniformInfo.name] = gl.getUniformLocation(this._program, uniformInfo.name);
            }
        }
    }
}