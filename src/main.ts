import './style.css'

import {Program} from './Program'
import {Quaternion, V3} from './Math'
import {vertex, fragment} from './shader/cube.glsl'
import {Rubics} from './Rubics'
import {Camera} from './Camera'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement
const gl = canvas.getContext('webgl2')!

gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LESS)

const program = new Program('cube.glsl', vertex, fragment, gl)
program.use()


const vertices = [
    .5,  .5,  0,    0, 0, 1,
    .5, -.5,  0,    0, 0, 1,
   -.5,  .5,  0,    0, 0, 1,
   -.5, -.5,  0,    0, 0, 1
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

const camera = new Camera(new V3(0, 0, -10), V3.zero, V3.up, 45, window.innerWidth / window.innerHeight, .1, 100)

const rubics = new Rubics(Quaternion.identity)

let mousedown = false
canvas.addEventListener('mousedown', () => mousedown = true)
canvas.addEventListener('mouseup', () => mousedown = false)
canvas.addEventListener('mousemove', event => {
  if (!mousedown) return
  const dx = event.movementX
  const dy = event.movementY
  if (dx === 0 && dy === 0) return
  const n = camera.up.scale(dy).add(camera.right.scale(dx))
  const axis = camera.forward.cross(n)
  const angle = Math.sqrt(dx * dx + dy * dy) * .3
  rubics.rotate(axis, angle)
})

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