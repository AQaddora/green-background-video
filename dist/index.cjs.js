'use strict';

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

var ChromaKeyVideo = function ChromaKeyVideo(_ref) {
  var videoSrc = _ref.videoSrc,
    _ref$width = _ref.width,
    width = _ref$width === void 0 ? 1080 : _ref$width,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? 1080 : _ref$height,
    _ref$keyColor = _ref.keyColor,
    keyColor = _ref$keyColor === void 0 ? '#00ff00' : _ref$keyColor,
    _ref$threshold = _ref.threshold,
    threshold = _ref$threshold === void 0 ? 0.4 : _ref$threshold,
    _ref$suppressionRange = _ref.suppressionRange,
    suppressionRange = _ref$suppressionRange === void 0 ? 0.1 : _ref$suppressionRange,
    _ref$transitionRange = _ref.transitionRange,
    transitionRange = _ref$transitionRange === void 0 ? 0.08 : _ref$transitionRange,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style;
  var canvasRef = React.useRef(null);
  var videoRef = React.useRef(null);
  React.useEffect(function () {
    var canvas = canvasRef.current;
    var video = videoRef.current;
    if (!canvas || !video) return;
    var gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported in this browser.');
      return;
    }

    // Vertex shader source code
    var vertexShaderSource = "\n            attribute vec4 a_position;\n            attribute vec2 a_texcoord;\n            varying vec2 v_texcoord;\n\n            void main() {\n                gl_Position = a_position;\n                v_texcoord = a_texcoord;\n            }\n        ";

    // Convert hex color to RGB
    var hexToRgb = function hexToRgb(hex) {
      var bigint = parseInt(hex.slice(1), 16);
      var r = bigint >> 16 & 255;
      var g = bigint >> 8 & 255;
      var b = bigint & 255;
      return [r / 255, g / 255, b / 255];
    };
    var keyColorRGB = hexToRgb(keyColor);
    var keyColorUV = [keyColorRGB[0] * -0.169 + keyColorRGB[1] * -0.331 + keyColorRGB[2] * 0.5 + 0.5, keyColorRGB[0] * 0.5 + keyColorRGB[1] * -0.419 + keyColorRGB[2] * -0.081 + 0.5];
    // Fragment shader source code for green chroma removal
    var fragmentShaderSource = "\n            precision highp float;\n            varying vec2 v_texcoord;\n            uniform sampler2D u_image;\n            vec2 RGBtoUV(vec3 rgb) {\n                return vec2(\n                    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,\n                    rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5\n                );\n            }\n            vec2 keyColorUV = vec2(".concat(keyColorUV[0], ", ").concat(keyColorUV[1], ");\n            void main() {\n                vec4 rgba = texture2D(u_image, v_texcoord);\n                float chromaDist = distance(RGBtoUV(rgba.rgb), keyColorUV);\n                float baseMask = chromaDist - ").concat(threshold, ";\n                float fullMask = pow(clamp(baseMask / ").concat(transitionRange, ", 0., 1.), 1.5);\n                rgba.a = fullMask;\n\n                float spillVal = pow(clamp(baseMask / ").concat(suppressionRange, ", 0., 1.), 1.5);\n                rgba.rgb *= spillVal;\n\n                gl_FragColor = rgba;\n            }\n        ");

    // Utility function to create shader
    function createShader(gl, type, source) {
      var shader = gl.createShader(type);
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
      var program = gl.createProgram();
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
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);

    // Look up the locations of the attributes and uniforms
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    // Set up the rectangle that covers the entire canvas
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    // Set up the texture coordinates for the rectangle
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
    var texture = gl.createTexture();
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
    var _updateCanvas = function updateCanvas() {
      // Create a texture from the image

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      video.requestVideoFrameCallback(_updateCanvas);
    };
    video.addEventListener('play', function () {
      _updateCanvas();
    });

    // Clean up when component unmounts
    return function () {
      video.removeEventListener('play', _updateCanvas);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texcoordBuffer);
      gl.deleteTexture(texture);
    };
  }, [videoSrc]);
  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("canvas", {
    ref: canvasRef,
    width: width,
    height: height,
    className: className,
    style: style
  }), /*#__PURE__*/React__default["default"].createElement("video", {
    ref: videoRef,
    src: videoSrc,
    width: width,
    height: height,
    crossOrigin: "anonymous",
    style: {
      display: 'none'
    },
    loop: true,
    playsInline: true,
    autoPlay: true
  }));
};

module.exports = ChromaKeyVideo;
//# sourceMappingURL=index.cjs.js.map
