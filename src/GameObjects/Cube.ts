import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {Program} from '../Program'

import {Plane} from '@GameObjects/Plane'
import {GameObject} from '@GameObjects/GameObject'
import {Transform, positionFirst} from '@GameObjects/Transform'


const planeInfo = {
    up: {color: new V3(1, 1, 1), pos: V3.up, axis: V3.left, angle: 90} as const,
    down: {color: new V3(1, 1, 0), pos: V3.down, axis: V3.left, angle: 270} as const,
    back: {color: new V3(1, 0, 0), pos: V3.back, axis: V3.down, angle: 180} as const,
    forward: {color: new V3(1, .5, 0), pos: V3.forward, axis: V3.down, angle: 0} as const,
    left: {color: new V3(0, 1, 0), pos: V3.left, axis: V3.down, angle: 90} as const,
    right: {color: new V3(0, 0, 1), pos: V3.right, axis: V3.down, angle: 270} as const,
} as const

class Cube implements GameObject {
    private _planes: Plane[] = []
    private _outsides: Plane[] = []
    public transform: Transform

    public constructor(position: V3, rotation: Quaternion, x: number, y: number, z: number, parent: GameObject) {
        this.transform = new Transform(position, rotation, positionFirst, parent)
        Object.entries(planeInfo).forEach(([dir, {color, pos, axis, angle}]) => {
            const inside = isInside(dir as keyof typeof planeInfo, x, y, z)
            if (inside)
                color = V3.zero

            const plane = new Plane(color, pos.scale(.5), Quaternion.fromAngle(axis, angle), this)
            this.transform.addChild(plane)
            this._planes.push(plane)
            if (inside) return 
            this._outsides.push(plane)
        })
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        this._planes.forEach(plane => plane.render(program, gl))
    }

    public get planes() {
        return this._outsides
    }
}

const isInside = (dir: keyof typeof planeInfo, x: number, y: number, z: number) => {
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