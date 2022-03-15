import './style.css'

import {Program, UniformFloat} from './Program'
import {lookAt, perspective, Quaternion, Transform, V3} from './Math'
import {vertex, fragment} from './shader/cube.glsl'
import {Rubics} from './Rubics'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!

gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LESS)

const program = new Program('cube.glsl', vertex, fragment, gl)
program.use()


const vertices = [
    1,  1,  0,    0, 0, 1,
    1, -1,  0,    0, 0, 1,
   -1,  1,  0,    0, 0, 1,
   -1, -1,  0,    0, 0, 1
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

gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0)
gl.enableVertexAttribArray(0)
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12)
gl.enableVertexAttribArray(1)


program.uniform('light.direction', new V3(0.2, -1, 0.3))
program.uniform('light.ambient', new V3(.2, .2, .2))
program.uniform('light.diffuse', new V3(.5, .5, .5))
program.uniform('light.specular', new V3(1, 1, 1))
program.uniform('shininess', new UniformFloat(32))
program.uniform('viewPos', new V3(0, 0, -10))

const rubicsTransform = Transform.identity
const rubics = new Rubics(rubicsTransform)
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

  rubics.render(program, gl)

  rubicsTransform.rotation = rubicsTransform.rotation.mult(Quaternion.fromAngle(new V3(1, 1, 0), 1))
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)