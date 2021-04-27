var engine;
// The entry point of our application
window.onload = function () {
    engine = new Hedron.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var Hedron;
(function (Hedron) {
    /**
     * The main game engine class
     * */
    var Engine = /** @class */ (function () {
        function Engine() {
            this._frameCount = 0;
        }
        Engine.prototype.start = function () {
            this._canvas = Hedron.GLUtilities.init("main-context");
            Hedron.gl.clearColor(0, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            this.createBuffer();
            this.resize();
            this.loop();
        };
        /**
         * Resize callback function
         * */
        Engine.prototype.resize = function () {
            if (this._canvas !== undefined) {
                this._canvas.width = window.innerWidth; // Represent the width of the page of our client
                this._canvas.height = window.innerHeight; // Represent the height of the page of our client
                Hedron.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
            }
        };
        Engine.prototype.loop = function () {
            this._frameCount++;
            Hedron.gl.clear(Hedron.gl.COLOR_BUFFER_BIT);
            // Set uniforms
            var colorPosition = this._shader.getUniformLocation("u_color");
            Hedron.gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            this._buffer.bind();
            this._buffer.draw();
            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        };
        Engine.prototype.createBuffer = function () {
            this._buffer = new Hedron.GLBuffer(3);
            var positionAttribute = new Hedron.AttributeInfo();
            positionAttribute.location = this._shader.getAttributeLocation("a_position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttribute(positionAttribute);
            var vertices = [
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0.5, 0,
                0.5, 0, 0,
                0, 0, 0,
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\nattribute vec3 a_position;\n\nvoid main() {\n    gl_Position = vec4(a_position, 1.0);\n}";
            var fragmentShaderSource = "\nprecision mediump float;\n\nuniform vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n";
            this._shader = new Hedron.Shader("basic", vertexShaderSource, fragmentShaderSource);
        };
        return Engine;
    }());
    Hedron.Engine = Engine;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    /**
     * Responsible for setting up a WebGL rendering context
     */
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        GLUtilities.init = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find element with id: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            Hedron.gl = canvas.getContext("webgl");
            if (Hedron.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    Hedron.GLUtilities = GLUtilities;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    /**
     * Represent a WebGL shader
     * */
    var Shader = /** @class */ (function () {
        /**
         * Creates a new shader
         * @param name The name of this shader
         * @param vertexSource The source of the vertex shader
         * @param fragmentSource The source of the fragment shader
         */
        function Shader(name, vertexSource, fragmentSource) {
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, Hedron.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, Hedron.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        }
        Object.defineProperty(Shader.prototype, "name", {
            /**
             * The name of the shader
             */
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Use this shader
         * */
        Shader.prototype.use = function () {
            Hedron.gl.useProgram(this._program);
        };
        /**
         * Gets the location of an attribute
         * @param name
         */
        Shader.prototype.getAttributeLocation = function (name) {
            if (this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named: '" + name + "' in shader named '" + this._name + "'");
            }
            return this._attributes[name];
        };
        /**
         * Gets the location of an uniform
         * @param name
         */
        Shader.prototype.getUniformLocation = function (name) {
            if (this._uniforms[name] === undefined) {
                throw new Error("Unable to find uniform named: '" + name + "' in shader named '" + this._name + "'");
            }
            return this._uniforms[name];
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = Hedron.gl.createShader(shaderType);
            Hedron.gl.shaderSource(shader, source);
            Hedron.gl.compileShader(shader);
            var errorLog = Hedron.gl.getShaderInfoLog(shader);
            if (errorLog !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + errorLog);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = Hedron.gl.createProgram();
            Hedron.gl.attachShader(this._program, vertexShader);
            Hedron.gl.attachShader(this._program, fragmentShader);
            Hedron.gl.linkProgram(this._program);
            var errorLog = Hedron.gl.getProgramInfoLog(this._program);
            if (errorLog !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + errorLog);
            }
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = Hedron.gl.getProgramParameter(this._program, Hedron.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var attributeInfo = Hedron.gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }
                this._attributes[attributeInfo.name] = Hedron.gl.getAttribLocation(this._program, attributeInfo.name);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var uniformCount = Hedron.gl.getProgramParameter(this._program, Hedron.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; i++) {
                var uniformInfo = Hedron.gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }
                this._uniforms[uniformInfo.name] = Hedron.gl.getUniformLocation(this._program, uniformInfo.name);
            }
        };
        return Shader;
    }());
    Hedron.Shader = Shader;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    /**
     * Represent the information needed for a  GLBuffer attribute.
     * */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    Hedron.AttributeInfo = AttributeInfo;
    /**
     * Represent a WebGL buffer
     * */
    var GLBuffer = /** @class */ (function () {
        /**
         * Create a new GL Buffer
         * @param elementSize The size of each element in this buffer
         * @param dataType The data type of this buffer. Default: gl.FLOAT
         * @param targetBufferType The buffer target type. gl.GL_ARRAY_BUFFER or gl.ELEMENT ARRAY_BUFFER. Default: gl.GL_ARRAY_BUFFER
         * @param mode The drawing mode of this buffer. (Ex: gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES
         */
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = Hedron.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = Hedron.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = Hedron.gl.TRIANGLES; }
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize; // Generally 3
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            // Determine byte size
            switch (this._dataType) {
                case Hedron.gl.FLOAT:
                case Hedron.gl.INT:
                case Hedron.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case Hedron.gl.SHORT:
                case Hedron.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case Hedron.gl.BYTE:
                case Hedron.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this._stride = this._elementSize * this._typeSize;
            this._buffer = Hedron.gl.createBuffer();
        }
        /**
         * Destroy the buffer
         * */
        GLBuffer.prototype.destroy = function () {
            Hedron.gl.deleteBuffer(this._buffer);
        };
        /**
         * Binds this buffer
         * @param normalized
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            Hedron.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var attr = _a[_i];
                    Hedron.gl.vertexAttribPointer(attr.location, attr.size, this._dataType, normalized, this._stride, attr.offset * this._typeSize);
                    Hedron.gl.enableVertexAttribArray(attr.location);
                }
            }
        };
        /**
         * Unbinds this buffer
         * */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var attr = _a[_i];
                Hedron.gl.disableVertexAttribArray(attr.location);
            }
            Hedron.gl.bindBuffer(this._targetBufferType, undefined);
        };
        /**
         * Adds an attribute with the provided information
         * @param info
         */
        GLBuffer.prototype.addAttribute = function (info) {
            this._hasAttributeLocation = true;
            this._attributes.push(info);
        };
        /**
         * Adds data to this buffer.
         * @param data
         */
        GLBuffer.prototype.pushBackData = function (data) {
            this._data = data;
        };
        /**
         * Upload this buffer's data to the GPU
         * */
        GLBuffer.prototype.upload = function () {
            Hedron.gl.bindBuffer(this._targetBufferType, this._buffer);
            var bufferData;
            switch (this._dataType) {
                case Hedron.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case Hedron.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case Hedron.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case Hedron.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case Hedron.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case Hedron.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case Hedron.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            Hedron.gl.bufferData(this._targetBufferType, bufferData, Hedron.gl.STATIC_DRAW);
        };
        /**
         * Draw this buffer
         * */
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType === Hedron.gl.ARRAY_BUFFER) {
                Hedron.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType === Hedron.gl.ELEMENT_ARRAY_BUFFER) {
                Hedron.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        return GLBuffer;
    }());
    Hedron.GLBuffer = GLBuffer;
})(Hedron || (Hedron = {}));
//# sourceMappingURL=main.js.map