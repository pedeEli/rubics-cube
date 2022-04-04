import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {mod} from '@Math/Util'
import {Program} from '../Program'

import {Plane, createTransform} from '@GameObjects/Plane'
import {GameObject} from '@GameObjects/GameObject'
import {Transform, positionFirst} from '@GameObjects/Transform'

const planeInfo = {
    up: {
        color: new V3(1, 1, 1),
        hovering: new V3(.7, .7, .7),
        pos: V3.up,
        rotation: Quaternion.fromAngle(V3.up, 180).mult(Quaternion.fromAngle(V3.left, 90))
    } as const,
    down: {
        color: new V3(1, 1, 0),
        hovering: new V3(.7, .7, 0),
        pos: V3.down,
        rotation: Quaternion.fromAngle(V3.left, 90)
    } as const,
    back: {
        color: new V3(1, 0, 0),
        hovering: new V3(.7, 0, 0),
        pos: V3.back,
        rotation: Quaternion.fromAngle(V3.forward, 180)
    } as const,
    forward: {
        color: new V3(1, .5, 0),
        hovering: new V3(.7, .3, 0),
        pos: V3.forward,
        rotation: Quaternion.fromAngle(V3.down, 0)
    } as const,
    left: {
        color: new V3(0, 1, 0),
        hovering: new V3(0, .7, 0),
        pos: V3.left,
        rotation: Quaternion.fromAngle(V3.up, 90)
    } as const,
    right: {
        color: new V3(0, 0, 1),
        hovering: new V3(0, 0, .7),
        pos: V3.right,
        rotation: Quaternion.fromAngle(V3.right, 180).mult(Quaternion.fromAngle(V3.up, 90))
    } as const,
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

type SideTransform = {
    x: Side[],
    y: Side[],
    z: Side[]
}
type AllSideTransforms = {
    up: SideTransform,
    down: SideTransform,
    right: SideTransform,
    left: SideTransform,
    forward: SideTransform,
    back: SideTransform
}
const sideTransforms: AllSideTransforms = {
    up: {
        x: ['up', 'back', 'down', 'forward'],
        y: ['up'],
        z: ['up', 'right', 'down', 'left']
    },
    down: {
        x: ['down', 'forward', 'up', 'back'],
        y: ['down'],
        z: ['down', 'left', 'up', 'right']
    },
    right: {
        x: ['right'],
        y: ['right', 'forward', 'left', 'back'],
        z: ['right', 'down', 'left', 'up']
    },
    left: {
        x: ['left'],
        y: ['left', 'back', 'right', 'forward'],
        z: ['left', 'up', 'right', 'down']
    },
    forward: {
        x: ['forward', 'up', 'back', 'down'],
        y: ['forward', 'left', 'back', 'right'],
        z: ['forward']
    },
    back: {
        x: ['back', 'down', 'forward', 'up'],
        y: ['back', 'right', 'forward', 'left'],
        z: ['back']
    }
}



class Cube implements GameObject {
    private _outsides: Plane[] = []
    public transform: Transform
    public index: V3

    public constructor(position: V3, rotation: Quaternion, x: number, y: number, z: number, parent: GameObject) {
        this.transform = new Transform(position, rotation, positionFirst, parent)
        this.index = new V3(x, y, z)
        Object.entries(planeInfo).forEach(([side, {color, hovering, pos, rotation}]) => {
            const inside = isInside(side as Side, x, y, z)
            if (inside)
                color = V3.zero

            const transform = createTransform(pos.scale(.5), rotation, this, inside)
            const plane = new Plane(color, hovering, transform, turnDirections[x][y][z][side as Side], side as Side)
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
    private _turnSpeed = 5
    private _turnProgress!: number
    private _axis!: V3
    private _targetAngle!: number
    private _initialRotation!: Quaternion
    private _targetRotation!: Quaternion

    public transformSides(axis: Axis, angle: number) {
        this._outsides.forEach(plane => {
            const currentSide = plane.side!
            const sides = sideTransforms[currentSide][axis]
            const index = mod(angle, sides.length)
            const newSide = sides[index]
            plane.side = newSide
            const {x, y, z} = this.index
            plane.turnDirections = turnDirections[x][y][z][newSide]
            if (!plane.turnDirections) debugger
        })
    }

    public rotate(axis: V3, angle: number) {
        this._turning = true
        this._turnProgress = 0
        this._initialRotation = this.transform.rotation
        this._axis = this._initialRotation.rotate(axis)
        this._targetAngle = angle * 90
        this._targetRotation = this._rotation!.mult(Quaternion.fromAngle(this._axis, this._targetAngle))
    }
    public update(delta: number) {
        if (!this._turning) return
        this._turnProgress += delta * this._turnSpeed
        if (this._turnProgress >= 1) {
            this._turning = false
            this.transform.rotation = this._targetRotation
            return
        }
        this.transform.rotation = Quaternion.lerp(this._initialRotation, this._targetRotation, this._turnProgress)
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
    Cube,
    planeInfo
}