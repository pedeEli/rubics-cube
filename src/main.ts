import './style.css'

import {Program} from './Program'
import {lookAt, perspective, Quaternion, V3} from './Math'
import {vertex, fragment} from './shader/cube.glsl'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!

gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LESS)

const program = new Program('cube.glsl', vertex, fragment, gl)
program.use()


const vertices = [
    1,  1,  0,
    1, -1,  0,
   -1,  1,  0,
   -1, -1,  0
]
const verticesBuffer = new Float32Array(vertices)
const vbo = gl.createBuffer()!

const indices = [
  0, 1, 2,
  1, 2, 3
]
const indicesBuffer = new Int8Array(indices)
const ebo = gl.createBuffer()!


const vao = gl.createVertexArray()!
gl.bindVertexArray(vao)

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer, gl.STATIC_DRAW)

gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
gl.bufferData(gl.ARRAY_BUFFER, verticesBuffer, gl.STATIC_DRAW)

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0)
gl.enableVertexAttribArray(0)

let rotation = Quaternion.fromAngle(new V3(1, 1, 0), 1)
const loop = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)

  const projection = perspective(45 * Math.PI / 180, width / height, .1, 100)
  program.uniform('projection', projection)

  const view = lookAt(new V3(0, 0, -10), new V3(0, 0, 0), new V3(0, 1, 0))
  program.uniform('view', view)

  const model = rotation.toMatrix()
  program.uniform('model', model)


  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)

  rotation = rotation.mult(Quaternion.fromAngle(new V3(1, 1, 0), .02))
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)