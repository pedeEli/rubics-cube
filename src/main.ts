import './style.css'

import {Program} from './Program'
import {lookAt, perspective, Quaternion, V3} from './Math'
import {vertex, fragment} from './shader/cube.glsl'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!


const program = new Program('cube.glsl', vertex, fragment, gl)
program.use()


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

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0)
gl.enableVertexAttribArray(0)

let angle = 0
const loop = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)

  const projection = perspective(45 * Math.PI / 180, width / height, .1, 100)
  program.uniformMatrix('projection', projection)

  const view = lookAt(new V3(0, 0, -10), new V3(0, 0, 0), new V3(0, 1, 0))
  program.uniformMatrix('view', view)

  const rotation = Quaternion.fromAngle(new V3(1, 1, 0), angle)
  const model = rotation.toMatrix()
  program.uniformMatrix('model', model)


  gl.drawArrays(gl.TRIANGLES, 0, 36)

  angle += .01
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)