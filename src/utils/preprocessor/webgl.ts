import { Filter } from "@/utils/preprocessor/Filter";

function createShader(
  gl: WebGLRenderingContext,
  shaderSource: string,
  shaderType: number
) {
  const shader = gl.createShader(shaderType);
  if (!shader) {
    throw new Error("创建shader失败");
  }
  // 导入GLSL源代码
  gl.shaderSource(shader, shaderSource);
  // 编译GLSL
  gl.compileShader(shader);
  // Check the compile status
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("编译shader失败" + lastError);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext, shaders: WebGLShader[]) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("create program failed");
  }

  shaders.forEach((shader) => gl.attachShader(program, shader));

  gl.linkProgram(program);

  // 检查链接是否成功
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // 链接错误
    gl.deleteProgram(program);
    throw new Error(
      "Error in program linking:" + gl.getProgramInfoLog(program)
    );
  }
  return program;
}

/**
 * 滤镜转GLSL着色器
 */
export function filter2GLSL(filters: Filter[]) {
  const fragmentShader = getFragmentShaderTemplate();
  let mainFunction =
    "void main() \n{\nvec4 color = texture2D(u_image, v_texCoord);\n";
  filters.forEach((filter) => {
    switch (filter.type) {
      case "binary":
        mainFunction += `binary(color,${filter.coreValue?.toFixed(4)});\n`;
        break;
      case "removeColor":
        mainFunction += `removeColor(color,${filter.coreValue?.toFixed(
          4
        )},${filter.tolerance?.toFixed(4)});\n`;
        break;
      case "reverse":
        mainFunction += "reverse(color);\n";
    }
  });
  mainFunction += "gl_FragColor = color;\n}";

  const vertexShader = getVertexShader();
  return {
    vertexShader: vertexShader,
    fragmentShader: fragmentShader + mainFunction,
  };
}

/**
 * 应用着色器并渲染
 * @param image
 * @param canvasEl
 * @param vertexShader
 * @param fragmentShader
 */
export function renderCanvas(
  image: ImageData,
  canvasEl: HTMLCanvasElement,
  vertexShader: string,
  fragmentShader: string
) {
  // Get A WebGL context
  const gl = canvasEl.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) throw new Error("浏览器不支持webgl");

  // 编译顶点着色器和像素着色器
  const program = createProgram(gl, [
    createShader(gl, vertexShader, gl.VERTEX_SHADER),
    createShader(gl, fragmentShader, gl.FRAGMENT_SHADER),
  ]);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // 初始化绝对坐标缓冲区
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    /**
     * 第一个三角形
     * [0, 0]
     * [width, 0]
     * [0, height]
     * 第二个三角形
     * [0, height]
     * [width, 0]
     * [width, height]
     */
    new Float32Array([
      0,
      0,
      image.width,
      0,
      0,
      image.height,
      0,
      image.height,
      image.width,
      0,
      image.width,
      image.height,
    ]),
    gl.STATIC_DRAW
  );

  // 初始化gl相对坐标缓冲区
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  );

  // 载入纹理贴图
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 兼容任何图像大小
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // 传入纹理贴图
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // lookup uniforms
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // 缓冲区绑定
  // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 components per iteration
  const type = gl.FLOAT; // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0; // start at the beginning of the buffer

  // 绑定绝对顶点坐标缓冲区
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // 绑定相对坐标缓冲区
  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.vertexAttribPointer(
    texcoordLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // set the resolution
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6); // 绘制矩形
}

// function setRectangle(
//   gl: WebGLRenderingContext,
//   x: number,
//   y: number,
//   width: number,
//   height: number
// ) {
//   // var x1 = x;
//   // var x2 = x + width;
//   // var y1 = y;
//   // var y2 = y + height;
//   gl.bufferData(
//     gl.ARRAY_BUFFER,
//     /**
//      * 第一个三角形
//      * [x1, y1]
//      * [x2, y1]
//      * [x1, y2]
//      * 第二个三角形
//      * [x1, y2]
//      * [x2, y1]
//      * [x2, y2]
//      */
//     new Float32Array([
//       0,
//       0,
//       width,
//       0,
//       0,
//       height,
//       0,
//       height,
//       width,
//       0,
//       width,
//       height,
//     ]),
//     gl.STATIC_DRAW
//   );
// }

const getFragmentShaderTemplate = () => {
  return `
precision mediump float;

// texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void reverse(inout vec4 color) {
    color.r = 1.0 - color.r;
    color.g = 1.0 - color.g;
    color.b = 1.0 - color.b;
}

void binary(inout vec4 color, float core) {
    // float light = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
    float light = (color.r + color.g + color.b)/3.0;
    if(light > core)
    {
        color = vec4(1.0, 1.0, 1.0, 1.0);
    }else{
        color = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

void removeColor(inout vec4 color, float core, float tolerance){
    vec3 hsl = rgb2hsv(color.rgb);
    if(abs(core - hsl.x) < tolerance)
    {
        color = vec4(1.0,1.0,1.0,1.0);
    }
}
`.replace(/\n/, "");
};

const getVertexShader = () => {
  return `
attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}
`.replace("\n", "");
};
