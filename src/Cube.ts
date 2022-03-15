import {V3, Transform, M44, Quaternion} from './Math'
import {Program} from './Program'
import {Plane} from './Plane'


class Cube {
    private planes: Plane[] = []

    public constructor(private transform: Transform) {
        this.planes.push(new Plane(new V3(1, 0, 0), new Transform(V3.forward, Quaternion.fromAngle(V3.down, 0), V3.one)))
        this.planes.push(new Plane(new V3(0, 1, 0), new Transform(V3.left, Quaternion.fromAngle(V3.down, 90), V3.one)))
        this.planes.push(new Plane(new V3(0, 0, 1), new Transform(V3.back, Quaternion.fromAngle(V3.down, 180), V3.one)))
        this.planes.push(new Plane(new V3(1, 0, 1), new Transform(V3.right, Quaternion.fromAngle(V3.down, 270), V3.one)))
        this.planes.push(new Plane(new V3(0, 1, 1), new Transform(V3.up, Quaternion.fromAngle(V3.left, 90), V3.one)))
        this.planes.push(new Plane(new V3(1, 1, 0), new Transform(V3.down, Quaternion.fromAngle(V3.left, 270), V3.one)))
    }

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        const t = parent.mult(this.transform.matrix)
        this.planes.forEach(plane => plane.render(t, program, gl))
    }
}

export {
    Cube
}