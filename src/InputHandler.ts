import {Rubics} from '@GameObjects/Rubics'
import {Camera} from '@GameObjects/Camera'
import {Plane} from '@GameObjects/Plane'
import {Cube, planeInfo} from '@GameObjects/Cube'

import {V2, V4} from '@Math/Vector'
import {getRotationAxis} from '@Math/Util'

import {Ray} from './Ray'
import { rotationFirst } from '@GameObjects/Transform'

interface SideInfo {
    dir: V2,
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
        this._canvas.addEventListener('mousemove', e => this._mousemove(e))
        this._canvas.addEventListener('mousedown', e => this._click(e))
        this._canvas.addEventListener('mouseup', e => this._mouseup(e))
    }

    
    private _turning = false
    private _mouse!: V2
    
    private _rightInfo!: SideInfo
    private _downInfo!: SideInfo
    private _side?: 'right' | 'down'

    // event handlers
    private _click({button, offsetX, offsetY}: MouseEvent) {
        if (button !== 0) return
        if (!this._hovering) return
        this._setSideInfo(offsetX, offsetY)
    }
    private _mousemove({offsetX, offsetY, movementX, movementY, buttons}: MouseEvent) {
        this._rotating = buttons === 4
        if (this._turning)
            return this._dragSide(offsetX, offsetY)
        this._removeHovering()
        if (this._rotating)
            return this._rotate(movementX, movementY)
        this._castRay(offsetX, offsetY)
    }
    private _mouseup(event: MouseEvent) {
        if (this._turning)
            return this._finishTurn()
    }

    // turning sides
    private _setSideInfo(offsetX: number, offsetY: number) {
        this._turning = true
        this._mouse = new V2(offsetX, this._canvas.height - offsetY)
        const side = this._hovering!.side!
        const info = planeInfo[side]

        const planeTransform = rotationFirst(info.pos.scale(.5), info.rotation)
        const rubicsTransform = this._rubics.transform.globalTransform
        const globalTransform = rubicsTransform.mult(planeTransform)
        const rotationTransform = globalTransform.inverse.transpose

        const left = rotationTransform.mult(new V4(0, -1, 0, 1)).toV3().normalized
        const top = rotationTransform.mult(new V4(-1, 0, 0, 1)).toV3().normalized
        const topLeft = globalTransform.mult(new V4(.5, .5, 0, 1)).toV3()

        const screenTopLeft = this._camera.worldToScreen(topLeft)
        const screenBottomLeft = this._camera.worldToScreen(topLeft.add(left))
        const screenTopRight = this._camera.worldToScreen(topLeft.add(top))
        const rightDir = screenTopRight.sub(screenTopLeft).normalized
        const downDir = screenBottomLeft.sub(screenTopLeft).normalized

        this._setTurnDirections(rightDir, downDir)

        this._rightInfo.cubes.forEach(cube => cube.backupRotation())
        this._downInfo.cubes.forEach(cube => cube.backupRotation())
        this._side = undefined
    }
    private _setTurnDirections(rightDir: V2, downDir: V2) {
        const {right, down} = this._hovering!.turnDirections!
        const [rightAxis, rightIndex] = right
        const [downAxis, downIndex] = down
        this._rightInfo = {
            dir: rightDir,
            axis: rightAxis,
            index: rightIndex,
            angle: 0,
            cubes: this._rubics.getPlane(rightAxis, rightIndex)
        }
        this._downInfo = {
            dir: downDir,
            axis: downAxis,
            index: downIndex,
            angle: 0,
            cubes: this._rubics.getPlane(downAxis, downIndex)
        }
    }
    private _dragSide(offsetX: number, offsetY: number) {
        if (!this._turning) return
        const mouse = new V2(offsetX, this._canvas.height - offsetY)
        if (this._mouse.sub(mouse).mag < 5)
            return
        if (this._side)
            return this._dragSingleSide(mouse, this[`_${this._side}Info`])

        const mouseDir = mouse.sub(this._mouse).normalized
        const rightDot = this._rightInfo.dir.dot(mouseDir)
        const downDot = this._downInfo.dir.dot(mouseDir)
        if (Math.abs(rightDot) > Math.abs(downDot)) {
            this._side = 'right'
            this._dragSingleSide(mouse, this._rightInfo)
            return
        }
        this._side = 'down'
        this._dragSingleSide(mouse, this._downInfo)
    }
    private _dragSingleSide(mouse: V2, info: SideInfo) {
        const length = info.dir.dot(this._mouse.sub(mouse))
        const rotationAxis = getRotationAxis(info.axis)
        info.angle = length / 3.4
        info.cubes.forEach(cube => {
            cube.resetRotation()
            cube.transform.rotate(rotationAxis, info.angle)
        })
    }
    private _finishTurn() {
        this._turning = false
        if (!this._side)
            return

        const info = this[`_${this._side}Info`]
        const angle = Math.round(info.angle / 90)
        this._rubics.turn(info.axis, info.index, angle)
    }


    private _rotate(dx: number, dy: number) {
        if (dx === 0 && dy === 0) return
        const n = this._camera.up.scale(dy).add(this._camera.right.scale(dx))
        const axis = this._camera.forward.cross(n)
        const angle = Math.sqrt(dx * dx + dy * dy) * .3
        this._rubics.transform.rotate(axis, angle)
    }
    private _castRay(offsetX: number, offsetY: number) {
        const ray = new Ray(this._camera, offsetX, offsetY, window.innerWidth, window.innerHeight)
        const planes = ray.intersectRubics(this._rubics)
        if (!planes.length) {
            this._hovering = undefined
            return
        }
        planes.sort((a, b) => a.d - b.d)
        planes[0].plane.hovering = true
        this._hovering = planes[0].plane
    }
    private _removeHovering() {
        this._rubics.cubes.forEach(cube => cube.planes.forEach(plane => plane.hovering = false))
    }
}

export {
    InputHandler
}