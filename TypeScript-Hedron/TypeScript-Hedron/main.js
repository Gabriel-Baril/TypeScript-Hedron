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
            this._sprite = new Hedron.Sprite("test");
            this._sprite.load();
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
                this._projection = Hedron.Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100, 100);
            }
        };
        Engine.prototype.loop = function () {
            this._frameCount++;
            Hedron.gl.clear(Hedron.gl.COLOR_BUFFER_BIT);
            // Set uniforms
            var colorPosition = this._shader.getUniformLocation("u_color");
            Hedron.gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            var projectionPosition = this._shader.getUniformLocation("u_projection");
            Hedron.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            var modelPosition = this._shader.getUniformLocation("u_model");
            var translationMat = Hedron.Matrix4x4.translation(this._sprite.position);
            Hedron.gl.uniformMatrix4fv(modelPosition, false, new Float32Array(translationMat.data));
            this._sprite.draw();
            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\nattribute vec3 a_position;\n\nuniform mat4 u_projection;\nuniform mat4 u_model;\n\nvoid main() {\n    gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n}";
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
var Hedron;
(function (Hedron) {
    var Sprite = /** @class */ (function () {
        function Sprite(name, width, height) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 100; }
            this.position = new Hedron.Vec3();
            this._name = name;
            this._width = width;
            this._height = height;
        }
        Sprite.prototype.load = function () {
            this._buffer = new Hedron.GLBuffer(3);
            var positionAttribute = new Hedron.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttribute(positionAttribute);
            var vertices = [
                0, 0, 0,
                0, this._height, 0,
                this._width, this._height, 0,
                this._width, this._height, 0,
                this._width, 0, 0,
                0, 0, 0,
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.draw = function () {
            this._buffer.bind();
            this._buffer.draw();
        };
        return Sprite;
    }());
    Hedron.Sprite = Sprite;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var Matrix4x4 = /** @class */ (function () {
        function Matrix4x4() {
            this._data = [];
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        }
        Object.defineProperty(Matrix4x4.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: false,
            configurable: true
        });
        Matrix4x4.identity = function () {
            return new Matrix4x4();
        };
        Matrix4x4.orthographic = function (left, right, bottom, top, nearClip, farClip) {
            var mat = Matrix4x4.identity();
            var lr = 1.0 / (left - right);
            var bt = 1.0 / (bottom - top);
            var nf = 1.0 / (nearClip - farClip);
            mat._data[0] = -2.0 * lr;
            mat._data[5] = -2.0 * bt;
            mat._data[10] = 2.0 * nf;
            mat._data[12] = (left + right) * lr;
            mat._data[13] = (top + bottom) * bt;
            mat._data[14] = (farClip + nearClip) * nf;
            return mat;
        };
        Matrix4x4.translation = function (position) {
            var mat = Matrix4x4.identity();
            mat._data[12] = position.x;
            mat._data[13] = position.y;
            mat._data[14] = position.z;
            return mat;
        };
        return Matrix4x4;
    }());
    Hedron.Matrix4x4 = Matrix4x4;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var Vec3 = /** @class */ (function () {
        function Vec3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this._x = x;
            this._y = y;
            this._z = z;
        }
        Object.defineProperty(Vec3.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
            },
            enumerable: false,
            configurable: true
        });
        Vec3.prototype.toArray = function () {
            return [this._x, this._y, this._z];
        };
        Vec3.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vec3;
    }());
    Hedron.Vec3 = Vec3;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    Hedron.MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";
    var AssetManager = /** @class */ (function () {
        function AssetManager() {
        }
        AssetManager.init = function () {
            AssetManager.registerLoader(new Hedron.ImageAssetLoader());
        };
        AssetManager.registerLoader = function (loader) {
            AssetManager._loaders.push(loader);
        };
        AssetManager.onAssetLoaded = function (asset) {
            AssetManager._loadedAssets[asset.name] = asset;
            Hedron.Message.send(Hedron.MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset); // emit
        };
        AssetManager.loadAsset = function (assetName) {
            var extension = assetName.split('.').pop().toLowerCase();
            for (var _i = 0, _a = AssetManager._loaders; _i < _a.length; _i++) {
                var loader = _a[_i];
                if (loader.supportedExtensions.indexOf(extension) !== -1) {
                    loader.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension " + extension + " because there is no loader associated with it.");
        };
        AssetManager.isAssetLoaded = function (assetName) {
            return AssetManager._loadedAssets[assetName] !== undefined;
        };
        AssetManager.getAsset = function (assetName) {
            if (AssetManager.isAssetLoaded(assetName)) {
                return AssetManager._loadedAssets[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        };
        AssetManager._loaders = [];
        AssetManager._loadedAssets = {};
        return AssetManager;
    }());
    Hedron.AssetManager = AssetManager;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var MessagePriority;
    (function (MessagePriority) {
        MessagePriority[MessagePriority["NORMAL"] = 0] = "NORMAL";
        MessagePriority[MessagePriority["HIGH"] = 1] = "HIGH";
    })(MessagePriority = Hedron.MessagePriority || (Hedron.MessagePriority = {}));
    var Message = /** @class */ (function () {
        function Message(code, sender, context, priority) {
            if (priority === void 0) { priority = MessagePriority.NORMAL; }
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }
        Message.send = function (code, sender, context) {
            Hedron.MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
        };
        Message.sendPriority = function (code, sender, context) {
            Hedron.MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
        };
        Message.subscribe = function (code, handler) {
            Hedron.MessageBus.addSubscription(code, handler);
        };
        Message.unsubscribe = function (code, handler) {
            Hedron.MessageBus.removeSubscription(code, handler);
        };
        return Message;
    }());
    Hedron.Message = Message;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var MessageBus = /** @class */ (function () {
        function MessageBus() {
        }
        MessageBus.addSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                MessageBus._subscriptions[code] = [];
            }
            if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
                console.warn("Attempting to add a duplicate handler to code: " + code + ". Subscription not added.");
            }
            else {
                MessageBus._subscriptions[code].push(handler);
            }
        };
        MessageBus.removeSubscription = function (code, handler) {
            if (MessageBus._subscriptions[code] === undefined) {
                console.warn("Cannot unsubscribe handler from code: " + code + " because that code is not subscribed to.");
                return;
            }
            var nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
            if (nodeIndex !== -1) {
                MessageBus._subscriptions[code].splice(nodeIndex, 1);
            }
        };
        MessageBus.post = function (message) {
            console.log("Message posted:", message);
            var handlers = MessageBus._subscriptions[message.code];
            if (handlers === undefined) {
                return;
            }
            for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                var handler = handlers_1[_i];
                if (message.priority === Hedron.MessagePriority.HIGH) {
                    handler.onMessage(message);
                }
                else {
                    MessageBus._normalMessageQueue.push(new Hedron.MessageSubscriptionNode(message, handler));
                }
            }
        };
        MessageBus.update = function (time) {
            if (MessageBus._normalMessageQueue.length === 0) {
                return;
            }
            var messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);
            for (var i = 0; i < messageLimit; i++) {
                var node = MessageBus._normalMessageQueue.pop();
                node.handler.onMessage(node.message);
            }
        };
        MessageBus._subscriptions = {};
        MessageBus._normalQueueMessagePerUpdate = 10;
        MessageBus._normalMessageQueue = [];
        return MessageBus;
    }());
    Hedron.MessageBus = MessageBus;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var MessageSubscriptionNode = /** @class */ (function () {
        function MessageSubscriptionNode(message, handler) {
            this.message = message;
            this.handler = handler;
        }
        return MessageSubscriptionNode;
    }());
    Hedron.MessageSubscriptionNode = MessageSubscriptionNode;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    var ImageAsset = /** @class */ (function () {
        function ImageAsset(name, data) {
            this.name = name;
            this.data = data;
        }
        Object.defineProperty(ImageAsset.prototype, "width", {
            get: function () {
                return this.data.width;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ImageAsset.prototype, "height", {
            get: function () {
                return this.data.height;
            },
            enumerable: false,
            configurable: true
        });
        return ImageAsset;
    }());
    Hedron.ImageAsset = ImageAsset;
    var ImageAssetLoader = /** @class */ (function () {
        function ImageAssetLoader() {
        }
        Object.defineProperty(ImageAssetLoader.prototype, "supportedExtensions", {
            get: function () {
                return ['png', 'gif', 'jpg'];
            },
            enumerable: false,
            configurable: true
        });
        ImageAssetLoader.prototype.loadAsset = function (assetName) {
            var image = new Image();
            image.onload = this.onImageLoaded.bind(this, assetName, image);
            image.src = assetName;
        };
        ImageAssetLoader.prototype.onImageLoaded = function (assetName, image) {
            console.log("onImageLoaded: assetName/image", assetName, image);
            var asset = new ImageAsset(assetName, image);
            Hedron.AssetManager.onAssetLoaded(asset);
        };
        return ImageAssetLoader;
    }());
    Hedron.ImageAssetLoader = ImageAssetLoader;
})(Hedron || (Hedron = {}));
//# sourceMappingURL=main.js.map