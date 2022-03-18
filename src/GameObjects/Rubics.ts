import {Cube} from '@GameObjects/Cube'
import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {Program} from '../Program'

import {GameObject} from '@GameObjects/GameObject'
import {Transform, rotationFirst} from '@GameObjects/Transform'

type Side = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange'

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
                    const position = new V3(x, y, z).sub(V3.one)
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

    public turn(side: Side) {
        if (side === 'blue')
            this.turnX(0)
        if (side === 'green')
            this.turnX(2)
        if (side === 'yellow')
            this.turnY(0)
        if (side === 'white')
            this.turnY(2)
        if (side === 'red')
            this.turnZ(0)
        if (side === 'orange')
            this.turnZ(2)
    }

    private turnX(index: number) {
        const plane = this._cubes[index]
        this.turnPlane(plane, V3.right, 90, 2, (y, z, cube) => this._cubes[index][y][z] = cube)
    }

    private turnY(index: number) {
        const plane = this._cubes.map(p => p[index])
        this.turnPlane(plane, V3.up, 90, 2, (x, z, cube) => this._cubes[x][index][z] = cube)
    }

    private turnZ(index: number) {
        const plane = this._cubes.map(p => p.map(r => r[index]))
        this.turnPlane(plane, V3.forward, 90, 6, (x, y, cube) => this._cubes[x][y][index] = cube)
    }

    private turnPlane(plane: Cube[][], axis: V3, angle: number, offset: number, setter: (x1: number, x2: number, cube: Cube) => void) {
        plane.flat(1).forEach(cube => {
            cube.transform.rotate(axis, angle)
        })

        const cubes = [
            plane[0][0],
            plane[0][1],
            plane[0][2],
            plane[1][2],
            plane[2][2],
            plane[2][1],
            plane[2][0],
            plane[1][0]
        ]
        const rotated = [...cubes.slice(8 - offset), ...cubes.slice(0, -offset)]
        setter(0, 0, rotated[0])
        setter(0, 1, rotated[1])
        setter(0, 2, rotated[2])
        setter(1, 2, rotated[3])
        setter(2, 2, rotated[4])
        setter(2, 1, rotated[5])
        setter(2, 0, rotated[6])
        setter(1, 0, rotated[7])
    }
}

export {
    Rubics
}