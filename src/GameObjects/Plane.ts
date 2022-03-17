import {M44} from '@Math/Matrix'
import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {makeTransform} from '@Math/Util'
import {Program, UniformInt} from '../Program'

class Plane {
    private _color: V3
    private _transform: M44
    private _position: V3
    private _rotation: Quaternion

    public intersects = false

    public constructor(color: V3, position: V3, rotation: Quaternion) {
        this._color = color
        this._position = position
        this._rotation = rotation
        this._transform = makeTransform(position, rotation)
    }

    public get transform() {
        return this._transform
    }

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        program.uniform('model', parent.mult(this._transform))
        program.uniform('color', this._color)
        program.uniform('intersects', new UniformInt(this.intersects ? 1 : 0))
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
    }
}

export {
    Plane
}