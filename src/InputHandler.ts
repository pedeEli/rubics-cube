import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {Ray} from './Ray'
import {V3} from '@Math/Vector'

class InputHandler {
    private _canvas: HTMLCanvasElement
    private _rubics: Rubics
    private _camera: Camera

    public constructor(canvas: HTMLCanvasElement, rubics: Rubics, camera: Camera) {
        this._canvas = canvas
        this._rubics = rubics
        this._camera = camera
    }

    public setupHandlers() {
        this._canvas.addEventListener('mousemove', e => this.rayHandler(e))
        this._canvas.addEventListener('mousemove', e => this.rotateHandler(e))
        document.addEventListener('keypress', e => this.keyHandler(e))
    }

    private keyHandler(event: KeyboardEvent) {
        if (event.key === 'w')
            this._rubics.turn('white')
        if (event.key === 'y')
            this._rubics.turn('yellow')
        if (event.key === 'b')
            this._rubics.turn('blue')
        if (event.key === 'g')
            this._rubics.turn('green')
        if (event.key === 'r')
            this._rubics.turn('red')
        if (event.key === 'o')
            this._rubics.turn('orange')
    }

    private rotateHandler(event: MouseEvent) {
        if (event.buttons !== 1) return
        const dx = event.movementX
        const dy = event.movementY
        if (dx === 0 && dy === 0) return
        const n = this._camera.up.scale(dy).add(this._camera.right.scale(dx))
        const axis = this._camera.forward.cross(n)
        const angle = Math.sqrt(dx * dx + dy * dy) * .3
        this._rubics.transform.rotate(axis, angle)
    }
    private rayHandler(event: MouseEvent) {
        this.removeHovering()
        const ray = new Ray(this._camera, event.offsetX, event.offsetY, window.innerWidth, window.innerHeight)
        const planes = ray.intersectRubics(this._rubics)
        if (!planes.length) return
        planes.sort((a, b) => a.d - b.d)
        planes[0].plane.hovering = true
    }
    private removeHovering() {
        this._rubics.cubes.forEach(cube => cube.planes.forEach(plane => plane.hovering = false))
    }
}

export {
    InputHandler
}