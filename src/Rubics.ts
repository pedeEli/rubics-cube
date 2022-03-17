import {Cube} from './Cube'
import {makeTransform, Quaternion, V3, M44} from './Math'
import {Program} from './Program'

class Rubics {
    private _cubes: Cube[][][] = []
    private _transform!: M44
    private _rotation: Quaternion

    public constructor(rotation: Quaternion) {
        this._rotation = rotation
        this.calcTransform()
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
            this._cubes.push(plane)
        }
    }
    private calcTransform() {
        this._transform = makeTransform(V3.zero, this._rotation)
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        this._cubes.forEach(
            plane => plane.forEach(
                row => row.forEach(
                    cube => cube.render(this._transform, program, gl))))
    }

    public rotate(axis: V3, angle: number) {
        this._rotation = this._rotation.mult(Quaternion.fromAngle(this._rotation.rotate(axis), angle))
        this.calcTransform()
    }

    public get transform() {
        return this._transform
    }
    public get cubes() {
        return this._cubes.flat(2)
    }
}

export {
    Rubics
}