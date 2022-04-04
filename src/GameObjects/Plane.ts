import {V3} from '@Math/Vector'
import {Program} from '../Program'

import {GameObject} from '@GameObjects/GameObject'
import {Transform, rotationFirst} from '@GameObjects/Transform'
import {Quaternion} from '@Math/Quarternion'
import {PlaneTransform} from '@GameObjects/PlaneTransform'
class Plane implements GameObject {
    private _color: V3
    private _hoveringColor: V3

    public hovering = false

    public constructor(color: V3, hoveringColor: V3, public transform: Transform, public turnDirections?: TurnDirections, public side?: Side) {
        this._color = color
        this._hoveringColor = hoveringColor
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        program.uniform('model', this.transform.globalTransform)
        program.uniform('color', this.hovering ? this._hoveringColor : this._color)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
    }
}

const createTransform = (position: V3, rotation: Quaternion, parent: GameObject, isInside: boolean) => {
    if (isInside)
        return new Transform(position, rotation, rotationFirst, parent)
    return new PlaneTransform(position, rotation, rotationFirst, parent)
}

export {
    Plane,
    createTransform
}