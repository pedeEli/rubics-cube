import './style.css'
import {Program} from './Program'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement

document.body.addEventListener('resize', () => {
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight
})


const gl = canvas.getContext('webgl2')!

const vertices = [
   1,  1,  1,
   1, -1,  1,
  -1, -1,  1,
   1,  1,  1,
  -1, -1,  1,
  -1,  1,  1,

   1,  1,  1,
   1,  1, -1,
   1, -1, -1,
   1,  1,  1,
   1, -1, -1,
   1, -1,  1,
  
   1,  1,  1,
   1,  1, -1,
  -1,  1, -1,
   1,  1,  1,
  -1,  1, -1,
  -1,  1,  1,

  -1, -1, -1,
   1, -1, -1,
   1, -1,  1,
  -1, -1, -1,
   1, -1,  1,
  -1, -1,  1,

  -1, -1, -1,
  -1, -1,  1,
  -1,  1,  1,
  -1, -1, -1,
  -1,  1,  1,
  -1,  1, -1,

  -1, -1, -1,
   1, -1, -1,
   1,  1, -1,
  -1, -1, -1,
   1,  1, -1,
  -1,  1, -1
]
const verticesBuffer = new Float32Array(vertices)

const vbo = gl.createBuffer()!

const vao = gl.createVertexArray()!
gl.bindVertexArray(vao)

gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
gl.bufferData(gl.ARRAY_BUFFER, verticesBuffer, gl.STATIC_DRAW)

gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 12, 0)
gl.enableVertexAttribArray(0)

gl.bindVertexArray(null)

const program = new Program('shader/cube.glsl', gl)
program.compileAndLinkPorgram()