import {Cube} from './Cube'
import {Quaternion, Transform, V3} from './Math'
import {Program} from './Program'

class Rubics {
    private cubes: Cube[][][] = []

    public constructor(public transform: Transform) {
        for (let x = 0; x < 3; x++) {
            const plane: Cube[][] = []
            for (let y = 0; y < 3; y++) {
                const row: Cube[] = []
                for (let z = 0; z < 3; z++) {
                    const transform = new Transform(new V3(x - 1, y - 1, z - 1).scale(1.2), Quaternion.fromAngle(V3.up, 0), V3.one.scale(.5))
                    const cube = new Cube(transform)
                    row.push(cube)
                }
                plane.push(row)
            }
            this.cubes.push(plane)
        }
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        const m = this.transform.matrix
        this.cubes.forEach(plane => plane.forEach(row => row.forEach(cube => cube.render(m, program, gl))))
    }
}

export {
    Rubics
}