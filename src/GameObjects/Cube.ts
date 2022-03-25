import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {Program} from '../Program'

import {Plane, createTransform} from '@GameObjects/Plane'
import {GameObject} from '@GameObjects/GameObject'
import {Transform, positionFirst} from '@GameObjects/Transform'

const planeInfo = {
    up: {color: new V3(1, 1, 1), hovering: new V3(.7, .7, .7), pos: V3.up, axis: V3.left, angle: 90} as const,
    down: {color: new V3(1, 1, 0), hovering: new V3(.7, .7, 0), pos: V3.down, axis: V3.left, angle: 270} as const,
    back: {color: new V3(1, 0, 0), hovering: new V3(.7, 0, 0), pos: V3.back, axis: V3.down, angle: 180} as const,
    forward: {color: new V3(1, .5, 0), hovering: new V3(.7, .3, 0), pos: V3.forward, axis: V3.down, angle: 0} as const,
    left: {color: new V3(0, 1, 0), hovering: new V3(0, .7, 0), pos: V3.left, axis: V3.up, angle: 90} as const,
    right: {color: new V3(0, 0, 1), hovering: new V3(0, 0, .7), pos: V3.right, axis: V3.up, angle: 270} as const,
} as const

type AllTurnDirections = {
    up?: TurnDirections,
    down?: TurnDirections,
    left?: TurnDirections,
    right?: TurnDirections,
    forward?: TurnDirections,
    back?: TurnDirections
}[][][]

const turnDirections: AllTurnDirections = [
    [
        [
            {right: {down: ['z', 0], right: ['y', 0]}, down: {right: ['z', 0], down: ['x', 0]}, back: {down: ['x', 0], right: ['y', 0]}},
            {right: {down: ['z', 1], right: ['y', 0]}, down: {right: ['z', 1], down: ['x', 0]}},
            {right: {down: ['z', 2], right: ['y', 0]}, down: {right: ['z', 2], down: ['x', 0]}, forward: {down: ['x', 0], right: ['y', 0]}}
        ],[
            {right: {down: ['z', 0], right: ['y', 1]}, back: {down: ['x', 0], right: ['y', 1]}},
            {right: {down: ['z', 1], right: ['y', 1]}},
            {right: {down: ['z', 2], right: ['y', 1]}, forward: {down: ['x', 0], right: ['y', 1]}}
        ],[
            {right: {down: ['z', 0], right: ['y', 2]}, up: {right: ['z', 0], down: ['x', 0]}, back: {down: ['x', 0], right: ['y', 2]}},
            {right: {down: ['z', 1], right: ['y', 2]}, up: {right: ['z', 1], down: ['x', 0]}},
            {right: {down: ['z', 2], right: ['y', 2]}, up: {right: ['z', 2], down: ['x', 0]}, forward: {down: ['x', 0], right: ['y', 2]}}
        ]
    ],[
        [
            {down: {right: ['z', 0], down: ['x', 1]}, back: {down: ['x', 1], right: ['y', 0]}},
            {down: {right: ['z', 1], down: ['x', 1]}},
            {down: {right: ['z', 2], down: ['x', 1]}, forward: {down: ['x', 1], right: ['y', 0]}}
        ],[
            {back: {down: ['x', 1], right: ['y', 1]}},
            {},
            {forward: {down: ['x', 1], right: ['y', 1]}}
        ],[
            {up: {right: ['z', 0], down: ['x', 1]}, back: {down: ['x', 1], right: ['y', 2]}},
            {up: {right: ['z', 1], down: ['x', 1]}},
            {up: {right: ['z', 2], down: ['x', 1]}, forward: {down: ['x', 1], right: ['y', 2]}}
        ]
    ],[
        [
            {left: {down: ['z', 0], right: ['y', 0]}, down: {right: ['z', 0], down: ['x', 2]}, back: {down: ['x', 2], right: ['y', 0]}},
            {left: {down: ['z', 1], right: ['y', 0]}, down: {right: ['z', 1], down: ['x', 2]}},
            {left: {down: ['z', 2], right: ['y', 0]}, down: {right: ['z', 2], down: ['x', 2]}, forward: {down: ['x', 2], right: ['y', 0]}}
        ],[
            {left: {down: ['z', 0], right: ['y', 1]}, back: {down: ['x', 2], right: ['y', 1]}},
            {left: {down: ['z', 1], right: ['y', 1]}},
            {left: {down: ['z', 2], right: ['y', 1]}, forward: {down: ['x', 2], right: ['y', 1]}}
        ],[
            {left: {down: ['z', 0], right: ['y', 2]}, up: {right: ['z', 0], down: ['x', 2]}, back: {down: ['x', 2], right: ['y', 2]}},
            {left: {down: ['z', 1], right: ['y', 2]}, up: {right: ['z', 1], down: ['x', 2]}},
            {left: {down: ['z', 2], right: ['y', 2]}, up: {right: ['z', 2], down: ['x', 2]}, forward: {down: ['x', 2], right: ['y', 2]}}
        ]
    ]
]



class Cube implements GameObject {
    private _outsides: Plane[] = []
    public transform: Transform
    public index: V3

    public constructor(position: V3, rotation: Quaternion, x: number, y: number, z: number, parent: GameObject) {
        this.transform = new Transform(position, rotation, positionFirst, parent)
        this.index = new V3(x, y, z)
        Object.entries(planeInfo).forEach(([side, {color, hovering, pos, axis, angle}]) => {
            const inside = isInside(side as Side, x, y, z)
            if (inside)
                color = V3.zero

            const transform = createTransform(pos.scale(.5), Quaternion.fromAngle(axis, angle), this, inside)
            const plane = new Plane(color, hovering, transform, turnDirections[x][y][z][side as Side])
            this.transform.addChild(plane)
            if (inside) return 
            this._outsides.push(plane)
        })
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        this.transform.forEachChildren(child => child.render?.call(child, program, gl))
    }

    public get planes() {
        return this._outsides
    }

    
    private _rotation?: Quaternion

    public backupRotation() {
        this._rotation = this.transform.rotation
    }
    public resetRotation() {
        if (!this._rotation)
            throw new Error('Fatal: No rotation has been backed up!')
        this.transform.rotation = this._rotation
    }


    private _turning = false
    private _turnSpeed = .5
    private _turnProgress = 0
    private _axis: V3 = V3.zero
    private _targetAngle = 0
    private _initialRotation: Quaternion = Quaternion.identity

    public rotate(axis: V3, angle: number) {
        this._turning = true
        this._turnProgress = 0
        this._initialRotation = this.transform.rotation
        this._axis = this._initialRotation.rotate(axis)
        this._targetAngle = angle
    }
    public update(delta: number) {
        if (!this._turning) return
        this._turnProgress += delta
        if (this._turnProgress >= this._turnSpeed) {
            this._turning = false
            this.transform.rotation = this._initialRotation.mult(Quaternion.fromAngle(this._axis, this._targetAngle))
            return
        }
        this.transform.rotation = this._initialRotation.mult(Quaternion.fromAngle(this._axis, this._targetAngle * this._turnProgress / this._turnSpeed))
    }
}

const isInside = (side: Side, x: number, y: number, z: number) => {
    return side === 'up'      && y !== 2
        || side === 'down'    && y !== 0
        || side === 'forward' && z !== 2
        || side === 'back'    && z !== 0
        || side === 'left'    && x !== 2
        || side === 'right'   && x !== 0
}

export {
    Cube
}