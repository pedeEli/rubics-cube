import './style.css'

import {Program} from './Program'
import {Quaternion} from '@Math/Quarternion'
import {V3} from '@Math/Vector'
import {vertex, fragment} from './Shader/cube.glsl'
import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {InputHandler} from './InputHandler'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!

gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LESS)

const program = new Program('cube.glsl', vertex, fragment, gl)
program.use()


const vertices = [
    .5,  .5,  0,
    .5, -.5,  0,
   -.5,  .5,  0,
   -.5, -.5,  0
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

const camera = new Camera(new V3(0, 0, -10), V3.zero, V3.up, 45, window.innerWidth / window.innerHeight, .1, 100)
const rubics = new Rubics(Quaternion.identity)
const inputHandler = new InputHandler(canvas, rubics, camera)
inputHandler.setupHandlers()

const resizeHandler = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height
  gl.viewport(0, 0, width, height)

  camera.aspect = width / height
}
window.addEventListener('resize', resizeHandler)
resizeHandler()


const loop = () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  program.uniform('view', camera.worldToCameraMatrix)
  program.uniform('projection', camera.projectionMatrix)

  rubics.render(program, gl)

  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)