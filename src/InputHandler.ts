import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {Plane} from '@GameObjects/Plane'
import {PlaneTransform} from '@GameObjects/PlaneTransform'
import {Cube} from '@GameObjects/Cube'

import {V2, V3} from '@Math/Vector'
import {getRotationAxis} from '@Math/Util'

import {Ray} from './Ray'
import {debug} from './Debugger'

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
        this._canvas.addEventListener('mousemove', e => this.dragHandler(e))
        this._canvas.addEventListener('mousedown', e => this.clickHandler(e))
        this._canvas.addEventListener('mouseup', () => {
            this._dragging = false
            this._cubes?.forEach(cube => cube.resetRotation())
        })
    }

    
    private _dragging = false
    private _topLeft!: V2
    private _right!: V2
    private _down!: V2
    private _mouse!: V2
    
    private _rightAxis!: Axis
    private _rightIndex!: number
    private _rightAngle!: number
    private _downAxis!: Axis
    private _downIndex!: number
    private _downAngle!: number
    private _cubes!: Cube[]

    private clickHandler(event: MouseEvent) {
        if (event.button !== 0) return
        if (!this._hovering) return

        this._dragging = true
        this._mouse = new V2(event.offsetX, this._canvas.height - event.offsetY)
        const {left, top, topLeft} = this._hovering!.transform as PlaneTransform

        const screenTopLeft = this._camera.worldToScreen(topLeft)
        const screenBottomLeft = this._camera.worldToScreen(topLeft.add(left))
        const screenTopRight = this._camera.worldToScreen(topLeft.add(top))
        this._right = screenTopRight.sub(screenTopLeft).normalized
        this._down = screenBottomLeft.sub(screenTopLeft).normalized
        this._topLeft = screenTopLeft

        this._setTurnDirections()
        // this._rightAxis = 'y'
        // this._rightIndex = turnDirections.y!
        // this._rightAngle = 0
        // this._downAxis = 'x'
        // this._downIndex = turnDirections.x!
        // this._downAngle = 0

        this._cubes = this._rubics.getPlane(this._rightAxis, this._rightIndex)
        this._cubes.forEach(cube => cube.backupRotation())
    }
    private _setTurnDirections() {
        const {right, down} = this._hovering!.turnDirections!
        const [rightAxis, rightIndex] = right
        const [downAxis, downIndex] = down
        this._rightAxis = rightAxis
        this._rightIndex = rightIndex
        this._downAxis = downAxis
        this._downIndex = downIndex
    }
    private dragHandler(event: MouseEvent) {
        if (!this._dragging) return
        const mouse = new V2(event.offsetX, this._canvas.height - event.offsetY)
        const deltaMouse = mouse.sub(this._mouse).normalized

        this._drawDebug(mouse)

        const length = this._right.dot(this._mouse.sub(mouse))
        const rotationAxis = getRotationAxis(this._rightAxis)
        this._cubes.forEach(cube => {
            cube.resetRotation()
            cube.transform.rotate(rotationAxis, length / 3.4)
        })

        // if (Math.abs(this._right.dot(deltaMouse)) > Math.abs(this._down.dot(deltaMouse))) {
        //     this.dragRightHandler(mouse)
        //     return
        // }
        // this.dragDownHandler(mouse)
    }
    private _drawDebug(mouse: V2) {
        debug.clear()
        debug.stroke('white')
        debug.vector(this._topLeft, this._right, 50)
        debug.vector(this._topLeft, this._down, 50)
        // debug.stroke('violet')
        // debug.line(this._topLeft, mouse)
        debug.stroke('limegreen')
        debug.line(this._mouse, mouse)
    }

    private dragRightHandler(mouse: V2) {
        const length = this._right.dot(this._mouse.sub(mouse))
        // console.log(length)
    }
    private dragDownHandler(mouse: V2) {
        const length = this._down.dot(this._mouse.sub(mouse))
        // console.log(length)
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