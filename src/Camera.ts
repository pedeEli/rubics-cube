import {V3, M44, perspective, lookAt} from './Math'

class Camera {
    private _position!: V3
    private _lookAt!: V3
    private _forward!: V3
    private _right!: V3
    private _up: V3

    private _fov!: number
    private _aspect!: number
    private _near!: number
    private _far!: number

    private _projectionMatrix!: M44
    private _worldToCameraMatrix!: M44
    private _projectionMatrixInverse!: M44
    private _cameraToWorldMatrix!: M44

    public constructor(position: V3, lookAt: V3, up: V3, fov: number, aspect: number, near: number, far: number) {
        this._position = position
        this._lookAt = lookAt
        this._up = up

        this._fov = fov
        this._aspect = aspect
        this._near = near
        this._far = far

        this.calcCameraDirections()
        this.calcWorldToCameraMatrix()
        this.calcProjectionMatrix()
    }


    public set position(value: V3) {
        this._position = value
        this.calcCameraDirections()
        this.calcWorldToCameraMatrix()
    }
    public set lookAt(value: V3) {
        this._lookAt = value
        this.calcCameraDirections()
        this.calcWorldToCameraMatrix()
    }
    public set up(value: V3) {
        this._up = value
        this.calcCameraDirections()
        this.calcWorldToCameraMatrix()
    }
    public get position() {
        return this._position
    }
    public get lookAt() {
        return this._lookAt
    }
    public get up() {
        return this._up
    }
    public get forward() {
        return this._forward
    }
    public get right() {
        return this._right
    }


    public set fov(value: number) {
        this._fov = value
        this.calcProjectionMatrix()
    }
    public set aspect(value: number) {
        this._aspect = value
        this.calcProjectionMatrix()
    }
    public set near(value: number) {
        this._near = value
        this.calcProjectionMatrix()
    }
    public set far(value: number) {
        this._far = value
        this.calcProjectionMatrix()
    }
    public get fov() {
        return this._fov
    }
    public get aspect() {
        return this._aspect
    }
    public get near() {
        return this._near
    }
    public get far() {
        return this._far
    }


    public get projectionMatrix() {
        return this._projectionMatrix
    }
    public get projectionMatrixInverse() {
        return this._projectionMatrixInverse
    }
    public get worldToCameraMatrix() {
        return this._worldToCameraMatrix
    }
    public get cameraToWorldMatrix() {
        return this._cameraToWorldMatrix
    }


    private calcProjectionMatrix() {
        this._projectionMatrix = perspective(this._fov * Math.PI / 180, this._aspect, this._near, this._far)
        this._projectionMatrixInverse = this._projectionMatrix.inverse
    }
    private calcWorldToCameraMatrix() {
        this._worldToCameraMatrix = lookAt(this._position, this._lookAt, this._up)
        this._cameraToWorldMatrix = this._worldToCameraMatrix.inverse
    }
    private calcCameraDirections() {
        this._forward = this._lookAt.sub(this._position).normalized
        this._right = this._up.cross(this._forward).normalized
    }
}


export {
    Camera
}