import {V4} from '@Math/Vector'

import {Rubics} from '@GameObjects/Rubics'
import {Plane} from '@GameObjects/Plane'
import {Camera} from '@GameObjects/Camera'
import {Ray} from './Ray'

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