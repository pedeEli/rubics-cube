import {Cube} from '@GameObjects/Cube'
import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {Program} from '../Program'

import {GameObject} from '@GameObjects/GameObject'
import {Transform, rotationFirst} from '@GameObjects/Transform'

class Rubics implements GameObject {
    private _cubes: Cube[][][] = []
    
    public transform: Transform

    public constructor(rotation: Quaternion) {
        this.transform = new Transform(V3.zero, rotation, rotationFirst)
        for (let x = 0; x < 3; x++) {
            const plane: Cube[][] = []
            for (let y = 0; y < 3; y++) {
                const row: Cube[] = []
                for (let z = 0; z < 3; z++) {
                    const position = new V3(x - 1, y - 1, z - 1).scale(1.02)
                    const cube = new Cube(position, Quaternion.identity, x, y, z, this)
                    this.transform.addChild(cube)
                    row.push(cube)
                }
                plane.push(row)
            }
            this._cubes.push(plane)
        }
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        this._cubes.forEach(
            plane => plane.forEach(
                row => row.forEach(
                    cube => cube.render(program, gl))))
    }

    public get cubes() {
        return this._cubes.flat(2)
    }
}

export {
    Rubics
}