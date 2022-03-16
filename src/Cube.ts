import {V3, M44, Quaternion, makeTransform, V4} from './Math'
import {Program} from './Program'
import {Plane} from './Plane'


class Cube {
    private planes: Plane[] = []

    public constructor(public position: V3, public rotation: Quaternion) {
        this.planes.push(new Plane(new V3(1, 0, 0), makeTransform(V3.forward.scale(.5), Quaternion.fromAngle(V3.down, 0))))
        this.planes.push(new Plane(new V3(0, 1, 0), makeTransform(V3.left.scale(.5), Quaternion.fromAngle(V3.down, 90))))
        this.planes.push(new Plane(new V3(0, 0, 1), makeTransform(V3.back.scale(.5), Quaternion.fromAngle(V3.down, 180))))
        this.planes.push(new Plane(new V3(1, 0, 1), makeTransform(V3.right.scale(.5), Quaternion.fromAngle(V3.down, 270))))
        this.planes.push(new Plane(new V3(0, 1, 1), makeTransform(V3.up.scale(.5), Quaternion.fromAngle(V3.left, 90))))
        this.planes.push(new Plane(new V3(1, 1, 0), makeTransform(V3.down.scale(.5), Quaternion.fromAngle(V3.left, 270))))
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

export {
    Cube
}