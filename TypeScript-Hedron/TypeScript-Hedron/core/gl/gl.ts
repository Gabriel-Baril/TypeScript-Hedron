namespace Hedron {
    /**
     * The WegGL rendering context
     * */
    export var gl: WebGLRenderingContext; // Entry point of WebGL

    /**
     * Responsible for setting up a WebGL rendering context
     */
    export class GLUtilities {

        public static init(elementId?: string): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if (elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;
                if (canvas === undefined) {
                    throw new Error("Cannot find element with id: " + elementId);
                }
            } else {
                canvas = document.createElement("canvas") as HTMLCanvasElement;
                document.body.appendChild(canvas);
            }

            gl = canvas.getContext("webgl");
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }

            return canvas;
        }
    }

}