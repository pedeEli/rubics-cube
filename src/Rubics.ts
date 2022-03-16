import {Cube} from './Cube'
import {makeTransform, Quaternion, V3} from './Math'
import {Program} from './Program'

class Rubics {
    private cubes: Cube[][][] = []

    public constructor(private rotation: Quaternion) {
        for (let x = 0; x < 3; x++) {
            const plane: Cube[][] = []
            for (let y = 0; y < 3; y++) {
                const row: Cube[] = []
                for (let z = 0; z < 3; z++) {
                    const position = new V3(x - 1, y - 1, z - 1).scale(1.02)
                    const cube = new Cube(position, Quaternion.identity, x, y, z)
                    row.push(cube)
                }
                plane.push(row)
            }
            this.cubes.push(plane)
        }
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        const transformMatrix = makeTransform(V3.zero, this.rotation)
        this.cubes.forEach(
            plane => plane.forEach(
                row => row.forEach(
                    cube => cube.render(transformMatrix, program, gl))))
    }

    public rotate(axis: V3, angle: number) {
        this.rotation = this.rotation.mult(Quaternion.fromAngle(this.rotation.rotate(axis), angle))
    }
}

export {
    Rubics
}