import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {Plane} from '@GameObjects/Plane'
import {PlaneTransform} from '@GameObjects/PlaneTransform'
import {Cube} from '@GameObjects/Cube'

import {V2} from '@Math/Vector'
import {getRotationAxis} from '@Math/Util'

import {Ray} from './Ray'
import {debug} from './Debugger'

interface SideInfo {
    axis: Axis,
    index: number,
    angle: number,
    cubes: Cube[]
}
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
            this._rightSide?.cubes.forEach(cube => cube.resetRotation())
            this._downSide?.cubes.forEach(cube => cube.resetRotation())
        })
    }

    
    private _dragging = false
    private _topLeft!: V2
    private _right!: V2
    private _down!: V2
    private _mouse!: V2
    
    private _rightSide!: SideInfo
    private _downSide!: SideInfo
    private _side?: 'right' | 'down'

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

        this._rightSide.cubes.forEach(cube => cube.backupRotation())
        this._downSide.cubes.forEach(cube => cube.backupRotation())
        this._side = undefined
    }
    private _setTurnDirections() {
        const {right, down} = this._hovering!.turnDirections!
        const [rightAxis, rightIndex] = right
        const [downAxis, downIndex] = down
        this._rightSide = {
            axis: rightAxis,
            index: rightIndex,
            angle: 0,
            cubes: this._rubics.getPlane(rightAxis, rightIndex)
        }
        this._downSide = {
            axis: downAxis,
            index: downIndex,
            angle: 0,
            cubes: this._rubics.getPlane(downAxis, downIndex)
        }
    }
    private dragHandler(event: MouseEvent) {
        if (!this._dragging) return
        const mouse = new V2(event.offsetX, this._canvas.height - event.offsetY)
        if (this._side === 'right')
            return this._dragRightHandler(mouse)
        if (this._side === 'down')
            return this._dragDownHandler(mouse)

        const mouseDir = mouse.sub(this._mouse).normalized
        if (Math.abs(this._right.dot(mouseDir)) > Math.abs(this._down.dot(mouseDir))) {
            this._side = 'right'
            this._dragRightHandler(mouse)
            return
        }
        this._side = 'down'
        this._dragDownHandler(mouse)
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

    private _dragRightHandler(mouse: V2): void {
        const length = this._right.dot(this._mouse.sub(mouse))
        const rotationAxis = getRotationAxis(this._rightSide.axis)
        this._rightSide.angle = length / 3.4
        this._rightSide.cubes.forEach(cube => {
            cube.resetRotation()
            cube.transform.rotate(rotationAxis, this._rightSide.angle)
        })
    }
    private _dragDownHandler(mouse: V2): void {
        const length = this._down.dot(this._mouse.sub(mouse))
        const rotationAxis = getRotationAxis(this._downSide.axis)
        this._downSide.angle = length / 3.4
        this._downSide.cubes.forEach(cube => {
            cube.resetRotation()
            cube.transform.rotate(rotationAxis, this._downSide.angle)
        })
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