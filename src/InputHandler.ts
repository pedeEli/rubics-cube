import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {Plane} from '@GameObjects/Plane'
import {Cube} from '@GameObjects/Cube'

import {Ray} from './Ray'

class InputHandler {
    private _canvas: HTMLCanvasElement
    private _rubics: Rubics
    private _camera: Camera

    private _rotating = false
    private _hovering?: Plane

    public constructor(canvas: HTMLCanvasElement, rubics: Rubics, camera: Camera) {
        this._canvas = canvas
        this._rubics = rubics
        this._camera = camera
    }

    public setupHandlers() {
        this._canvas.addEventListener('mousemove', e => this.rayHandler(e))
        this._canvas.addEventListener('mousemove', e => this.rotateHandler(e))
        this._canvas.addEventListener('click', e => this.clickHandler(e))
        document.addEventListener('keypress', e => this.keyHandler(e))
    }

    private clickHandler(event: MouseEvent) {
        if (event.button !== 0) return
        if (!this._hovering) return
        
        const cube = this._hovering.transform.parent as Cube
        const {x, y, z} = cube.index
        const isCenter = x === 1 && y === 1
                      || x === 1 && z === 1
                      || y === 1 && z === 1
        if (!isCenter) return

        if (x === 0)
            return this._rubics.turn('blue')
        if (x === 2)
            return this._rubics.turn('green')
        if (y === 0)
            return this._rubics.turn('yellow')
        if (y === 2)
            return this._rubics.turn('white')
        if (z === 0)
            return this._rubics.turn('red')
        if (z === 2)
            return this._rubics.turn('orange')
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
        this._rotating = event.buttons === 4
        if (!this._rotating) return
        this.removeHovering()
        const dx = event.movementX
        const dy = event.movementY
        if (dx === 0 && dy === 0) return
        const n = this._camera.up.scale(dy).add(this._camera.right.scale(dx))
        const axis = this._camera.forward.cross(n)
        const angle = Math.sqrt(dx * dx + dy * dy) * .3
        this._rubics.transform.rotate(axis, angle)
    }
    private rayHandler(event: MouseEvent) {
        if (this._rotating) return
        this.removeHovering()
        const ray = new Ray(this._camera, event.offsetX, event.offsetY, window.innerWidth, window.innerHeight)
        const planes = ray.intersectRubics(this._rubics)
        if (!planes.length) {
            this._hovering = undefined
            return
        }
        planes.sort((a, b) => a.d - b.d)
        planes[0].plane.hovering = true
        this._hovering = planes[0].plane
    }
    private removeHovering() {
        this._rubics.cubes.forEach(cube => cube.planes.forEach(plane => plane.hovering = false))
    }
}

export {
    InputHandler
}