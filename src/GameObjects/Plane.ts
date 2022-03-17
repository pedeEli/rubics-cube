import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {Program, UniformInt} from '../Program'

import {GameObject} from '@GameObjects/GameObject'
import {Transform, rotationFirst} from '@GameObjects/Transform'

class Plane implements GameObject {
    private _color: V3
    public transform: Transform

    public hovering = false

    public constructor(color: V3, position: V3, rotation: Quaternion, parent: GameObject) {
        this._color = color
        this.transform = new Transform(position, rotation, rotationFirst, parent)
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        program.uniform('model', this.transform.globalTransform)
        program.uniform('color', this._color)
        program.uniform('intersects', new UniformInt(this.hovering ? 1 : 0))
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
    }
}

export {
    Plane
}