import {V4, V3} from '@Math/Vector'

import {Transform, CalcTransform} from '@GameObjects/Transform'
import {Quaternion} from '@Math/Quarternion'
import {GameObject} from '@GameObjects/GameObject'

class PlaneTransform extends Transform {
    public left!: V3
    public top!: V3
    public normal!: V3
    public positionTopLeft!: V3
    public positionBottomRight!: V3

    public constructor(position: V3, rotation: Quaternion, calcTransform: CalcTransform, parent?: GameObject) {
        super(position, rotation, calcTransform, parent)
        this._setTransforms()
    }

    protected _setTransforms() {
        super._setTransforms()

        this.positionTopLeft = this.globalTransform.mult(new V4(.5, .5, 0, 1)).toV3()
        this.positionBottomRight = this.globalTransform.mult(new V4(-.5, -.5, 0, 1)).toV3()

        const rotationTransform = this.globalTransform.inverse.transpose

        this.left = rotationTransform.mult(new V4(0, -1, 0, 1)).toV3().normalized
        this.top = rotationTransform.mult(new V4(-1, 0, 0, 1)).toV3().normalized
        this.normal = rotationTransform.mult(new V4(0, 0, -1, 1)).toV3().normalized
    }
}

export {
    PlaneTransform
}