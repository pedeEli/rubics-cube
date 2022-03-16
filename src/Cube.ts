import {V3, M44, Quaternion, makeTransform, V4} from './Math'
import {Program} from './Program'
import {Plane} from './Plane'


const planeInfo = {
    up: {color: new V3(1, 1, 1), pos: V3.up, axis: V3.left, angle: 90} as const,
    down: {color: new V3(0, 1, 1), pos: V3.down, axis: V3.left, angle: 270} as const,
    back: {color: new V3(1, 0, 0), pos: V3.back, axis: V3.down, angle: 180} as const,
    forward: {color: new V3(1, .5, 0), pos: V3.forward, axis: V3.down, angle: 0} as const,
    left: {color: new V3(0, 1, 0), pos: V3.left, axis: V3.down, angle: 90} as const,
    right: {color: new V3(0, 0, 1), pos: V3.right, axis: V3.down, angle: 270} as const,
} as const

class Cube {
    private planes: Plane[] = []

    public constructor(private position: V3, private rotation: Quaternion, x: number, y: number, z: number) {
        Object.entries(planeInfo).forEach(([dir, {color, pos, axis, angle}]) => {
            if (isColorBlack(dir as keyof typeof planeInfo, x, y, z))
                color = V3.zero

            const transformMatrix = makeTransform(pos.scale(.5), Quaternion.fromAngle(axis, angle))
            this.planes.push(new Plane(color, transformMatrix))
        })


        // this.planes.push(new Plane(new V3(1, 0, 0), makeTransform(V3.forward.scale(.5), Quaternion.fromAngle(V3.down, 0))))
        // this.planes.push(new Plane(new V3(0, 1, 0), makeTransform(V3.left.scale(.5), Quaternion.fromAngle(V3.down, 90))))
        // this.planes.push(new Plane(new V3(0, 0, 1), makeTransform(V3.back.scale(.5), Quaternion.fromAngle(V3.down, 180))))
        // this.planes.push(new Plane(new V3(1, 0, 1), makeTransform(V3.right.scale(.5), Quaternion.fromAngle(V3.down, 270))))
        // this.planes.push(new Plane(new V3(0, 1, 1), makeTransform(V3.up.scale(.5), Quaternion.fromAngle(V3.left, 90))))
        // this.planes.push(new Plane(new V3(1, 1, 0), makeTransform(V3.down.scale(.5), Quaternion.fromAngle(V3.left, 270))))
    }

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        const {x, y, z} = this.position
        const positionMatrix = new M44(
            new V4(1, 0, 0, x),
            new V4(0, 1, 0, y),
            new V4(0, 0, 1, z),
            new V4(0, 0, 0, 1)
        )
        const rotationMatrix = this.rotation.matrix
        const transformMatrix = parent.mult(rotationMatrix).mult(positionMatrix)
        this.planes.forEach(plane => plane.render(transformMatrix, program, gl))
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