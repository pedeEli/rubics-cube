import {M44} from '@Math/Matrix';
import {Quaternion} from '@Math/Quarternion';
import {V3, V4} from '@Math/Vector';

import {GameObject} from '@GameObjects/GameObject'

type CalcTransform = (position: V3, rotation: Quaternion) => M44

class Transform {
    private _position: V3
    private _rotation: Quaternion
    public localTransform!: M44
    public globalTransform!: M44
    private _calcTransform: CalcTransform

    private _children: GameObject[] = []
    private _parent?: GameObject

    public constructor(position: V3, rotation: Quaternion, calcTransform: CalcTransform, parent?: GameObject) {
        this._position = position
        this._rotation = rotation
        this._calcTransform = calcTransform
        this._parent = parent
        this._setTransforms()
    }

    protected _setTransforms() {
        const localTransform = this._calcTransform(this._position, this._rotation)
        this.localTransform = localTransform

        if (!this._parent) {
            this.globalTransform = localTransform
        } else {
            const parentTransform = this._parent.transform.globalTransform
            this.globalTransform = parentTransform.mult(localTransform)
        }

        this._children.forEach(child => child.transform._setTransforms())
    }

    public addChild(child: GameObject) {
        this._children.push(child)
    }


    public rotate(axis: V3, angle: number) {
        this.rotation = this._rotation.mult(Quaternion.fromAngle(this._rotation.rotate(axis), angle))
    }

    public set position(value: V3) {
        this._position = value
        this._setTransforms()
    }
    public set rotation(value: Quaternion) {
        this._rotation = value
        this._setTransforms()
    }

    public get position() {
        return this._position
    }
    public get rotation() {
        return this._rotation
    }
    public get parent() {
        return this._parent
    }

    public forEachChildren(f: (child: GameObject) => void) {
        this._children.forEach(f)
    }
}

const rotationFirst: CalcTransform = ({x, y, z}, rotation) => {
    const transform = rotation.matrix
    transform.r1.w = x
    transform.r2.w = y
    transform.r3.w = z
    return transform
}

const positionFirst: CalcTransform = ({x, y, z}, rotation) => {
    const positionMatrix = new M44(
        new V4(1, 0, 0, x),
        new V4(0, 1, 0, y),
        new V4(0, 0, 1, z),
        new V4(0, 0, 0, 1)
    )
    const rotationMatrix = rotation.matrix
    return rotationMatrix.mult(positionMatrix)
}

export {
    Transform,
    CalcTransform,
    rotationFirst,
    positionFirst
}