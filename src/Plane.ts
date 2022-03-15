import {V3, Transform, M44} from './Math'
import {Program} from './Program'

class Plane {
    public constructor(private color: V3, private transform: Transform) {}

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        program.uniform('model', parent.mult(this.transform.matrix))
        program.uniform('color', this.color)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
    }
}

export {
    Plane
}