import {V3, perspective, lookAt} from './Math'
import {Program} from './Program'

class Camera {
    private _lookAt: V3 = V3.zero
    private _forward: V3 = V3.zero
    private _right: V3 = V3.zero
    private _up: V3

    public constructor(public position: V3, lookAt: V3, up: V3, public fov: number, public near: number, public far: number) {
        this._up = up
        this.lookAt = lookAt
    }

    public set lookAt(value: V3) {
        this._lookAt = value
        this._forward = value.sub(this.position).normalized
        this._right = this._up.cross(this._forward).normalized
    }
    public get forward() {
        return this._forward
    }
    public get right() {
        return this._right
    }
    public get up() {
        return this._up
    }

    public setProjectionMatrix(program: Program, width: number, height: number) {
        const aspect = width / height
        const projection = perspective(this.fov * Math.PI / 180, aspect, this.near, this.far)
        program.uniform('projection', projection)
    }
    public setViewMatrix(program: Program) {
        const view = lookAt(this.position, this._lookAt, this._up)
        program.uniform('view', view)
    }
}


export {
    Camera
}