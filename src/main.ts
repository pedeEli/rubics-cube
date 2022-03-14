import './style.css'

const canvas = document.querySelector('[data-canvas]') as HTMLCanvasElement

document.body.addEventListener('resize', () => {
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight
})
