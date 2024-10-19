import React, { useRef, useEffect } from 'react';

const ChromaKeyVideo = ({ videoSrc, width = 1080, height = 1080, keyColor = '#00ff00', threshold = 0.4, suppressionRange = 0.1, transitionRange = 0.08, className = '', style = {}}) => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported in this browser.');
            return;
        }


        // Vertex shader source code
        const vertexShaderSource = `
            attribute vec4 a_position;
            attribute vec2 a_texcoord;
            varying vec2 v_texcoord;

            void main() {
                gl_Position = a_position;
                v_texcoord = a_texcoord;
            }
        `;

        // Convert hex color to RGB
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r / 255, g / 255, b / 255];
        };

        const keyColorRGB = hexToRgb(keyColor);
        const keyColorUV = [
            keyColorRGB[0] * -0.169 + keyColorRGB[1] * -0.331 + keyColorRGB[2] * 0.5 + 0.5,
            keyColorRGB[0] * 0.5 + keyColorRGB[1] * -0.419 + keyColorRGB[2] * -0.081 + 0.5
        ];
        // Fragment shader source code for green chroma removal
        const fragmentShaderSource = `
            precision highp float;
            varying vec2 v_texcoord;
            uniform sampler2D u_image;
            vec2 RGBtoUV(vec3 rgb) {
                return vec2(
                    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,
                    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5
                );
            }
            vec2 keyColorUV = vec2(${keyColorUV[0]}, ${keyColorUV[1]});
            void main() {
                vec4 rgba = texture2D(u_image, v_texcoord);
                float chromaDist = distance(RGBtoUV(rgba.rgb), keyColorUV);
                float baseMask = chromaDist - ${threshold};
                float fullMask = pow(clamp(baseMask / ${transitionRange}, 0., 1.), 1.5);
                rgba.a = fullMask;

                float spillVal = pow(clamp(baseMask / ${suppressionRange}, 0., 1.), 1.5);
                rgba.rgb *= spillVal;

                gl_FragColor = rgba;
            }
        `;

        // Utility function to create shader
        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compile failed with: " + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        // Utility function to create program
        function createProgram(gl, vertexShader, fragmentShader) {
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("Program link failed with: " + gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        }

        // Create shaders and program
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        // Look up the locations of the attributes and uniforms
        const positionLocation = gl.getAttribLocation(program, "a_position");
        const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

        // Set up the rectangle that covers the entire canvas
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        // Set up the texture coordinates for the rectangle
        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Set up WebGL state
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Use the shader program
        gl.useProgram(program);

        // Bind the position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Bind the texture coordinate buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        const updateCanvas = () => {
            // Create a texture from the image

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            video.requestVideoFrameCallback(updateCanvas);
        };

        video.addEventListener('play', () => {
            updateCanvas();
        });

        // Clean up when component unmounts
        return () => {
            video.removeEventListener('play', updateCanvas);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
            gl.deleteBuffer(texcoordBuffer);
            gl.deleteTexture(texture);
        };
    }, [videoSrc]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={className}
                style={ style }
            ></canvas>
            <video
                ref={videoRef}
                src={videoSrc}
                width={width}
                height={height}
                crossOrigin="anonymous"
                style={{ display: 'none' }}
                loop
                playsInline
                autoPlay
            />
        </>
    );
};

export default ChromaKeyVideo;
