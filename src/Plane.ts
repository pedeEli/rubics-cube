import {V3, M44} from './Math'
import {Program} from './Program'

class Plane {
    public constructor(private color: V3, private transform: M44) {}

    public render(parent: M44, program: Program, gl: WebGL2RenderingContext) {
        program.uniform('model', parent.mult(this.transform))
        program.uniform('color', this.color)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
    }
}

export {
    Plane
}