import {V3, M44, Quaternion, makeTransform, V4} from './Math'
import {Program} from './Program'
import {Plane} from './Plane'


const planeInfo = {
    up: {color: new V3(1, 1, 1), pos: V3.up, axis: V3.left, angle: 90} as const,
    down: {color: new V3(1, 1, 0), pos: V3.down, axis: V3.left, angle: 270} as const,
    back: {color: new V3(1, 0, 0), pos: V3.back, axis: V3.down, angle: 180} as const,
    forward: {color: new V3(1, .5, 0), pos: V3.forward, axis: V3.down, angle: 0} as const,
    left: {color: new V3(0, 1, 0), pos: V3.left, axis: V3.down, angle: 90} as const,
    right: {color: new V3(0, 0, 1), pos: V3.right, axis: V3.down, angle: 270} as const,
} as const

class Cube {
    private _planes: Plane[] = []
    private _position: V3
    private _rotation: Quaternion
    private _transform!: M44

    public constructor(position: V3, rotation: Quaternion, x: number, y: number, z: number) {
        this._position = position
        this._rotation = rotation
        this.calcTransform()
        Object.entries(planeInfo).forEach(([dir, {color, pos, axis, angle}]) => {
            if (isColorBlack(dir as keyof typeof planeInfo, x, y, z))
                color = V3.zero

            this._planes.push(new Plane(color, pos.scale(.5), Quaternion.fromAngle(axis, angle)))
        })
    }
    private calcTransform() {
        const {x, y, z} = this._position
        const positionMatrix = new M44(
            new V4(1, 0, 0, x),
            new V4(0, 1, 0, y),
            new V4(0, 0, 1, z),
            new V4(0, 0, 0, 1)
        )
        const rotationMatrix = this._rotation.matrix
        this._transform = rotationMatrix.mult(positionMatrix)
    }

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        const transform = parent.mult(this._transform)
        this._planes.forEach(plane => plane.render(transform, program, gl))
    }

    public get transform() {
        return this._transform
    }
    public get planes() {
        return this._planes
    }
}

const isColorBlack = (dir: keyof typeof planeInfo, x: number, y: number, z: number) => {
    return dir === 'up'      && y !== 2
        || dir === 'down'    && y !== 0
        || dir === 'forward' && z !== 2
        || dir === 'back'    && z !== 0
        || dir === 'left'    && x !== 2
        || dir === 'right'   && x !== 0
}

export {
    Cube
}