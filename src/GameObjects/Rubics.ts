import {Cube} from '@GameObjects/Cube'
import {V3} from '@Math/Vector'
import {Quaternion} from '@Math/Quarternion'
import {mod} from '@Math/Util'
import {Program} from '../Program'

import {GameObject} from '@GameObjects/GameObject'
import {Transform, rotationFirst} from '@GameObjects/Transform'

interface TurnEvent {
    axis: Axis,
    index: number,
    angle: number
}

class Rubics implements GameObject {
    private _cubes: Cube[][][] = []
    
    public transform: Transform

    private _listeners = new Set<(event: TurnEvent) => void>()

    public constructor(rotation: Quaternion) {
        this.transform = new Transform(V3.zero, rotation, rotationFirst)
        for (let x = 0; x < 3; x++) {
            const plane: Cube[][] = []
            for (let y = 0; y < 3; y++) {
                const row: Cube[] = []
                for (let z = 0; z < 3; z++) {
                    const position = new V3(x, y, z).sub(V3.one)
                    const cube = new Cube(
                        position,
                        Quaternion.identity,
                        x,
                        y,
                        z,
                        this,
                        this._startCubeTurn.bind(this),
                        this._endCubeTurn.bind(this)
                    )
                    this.transform.addChild(cube)
                    row.push(cube)
                }
                plane.push(row)
            }
            this._cubes.push(plane)
        }
    }

    public render(program: Program, gl: WebGL2RenderingContext) {
        this.transform.forEachChildren(child => child.render?.call(child, program, gl))
    }
    public update(delta: number) {
        this.transform.forEachChildren(child => child.update?.call(child, delta))
    }

    public get cubes() {
        return this._cubes.flat(2)
    }


    public getPlane(axis: Axis, index: number) {
        if (axis === 'x')
            return this._cubes[index].flat()
        if (axis === 'y')
            return this._cubes.map(p => p[index]).flat()
        return this._cubes.map(p => p.map(r => r[index])).flat()
    }

    public turn(axis: Axis, index: number, angle: number) {
        this._dispatchTurnEvent(axis, index, angle)
        if (axis === 'x')
            return this._turnX(index, angle)
        if (axis === 'y')
            return this._turnY(index, angle)
        this._turnZ(index, angle)
    }

    private _currentCubesTurning = 0

    public get isTurning() {
        return this._currentCubesTurning !== 0
    }

    private _startCubeTurn() {
        this._currentCubesTurning++
    }
    
    private _endCubeTurn() {
        this._currentCubesTurning--
    }


    private _turnX(index: number, angle: number) {
        const plane = this._cubes[index]
        this._turnPlane(plane, 'x', V3.right, angle, mod(2 * angle, 8), (y, z, cube) => {
            cube.index = new V3(index, y, z)
            this._cubes[index][y][z] = cube
        })
    }

    private _turnY(index: number, angle: number) {
        const plane = this._cubes.map(p => p[index])
        this._turnPlane(plane, 'y', V3.up, angle, mod(2 * angle, 8), (x, z, cube) => {
            cube.index = new V3(x, index, z)
            this._cubes[x][index][z] = cube
        })
    }

    private _turnZ(index: number, angle: number) {
        const plane = this._cubes.map(p => p.map(r => r[index]))
        this._turnPlane(plane, 'z', V3.forward, angle, mod(-2 * angle, 8), (x, y, cube) => {
            cube.index = new V3(x, y, index)
            this._cubes[x][y][index] = cube
        })
    }

    private _turnPlane(plane: Cube[][], axisName: Axis, axis: V3, angle: number, offset: number, setter: (x1: number, x2: number, cube: Cube) => void) {
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
        if (rotated.length) {   
            setter(0, 0, rotated[0])
            setter(0, 1, rotated[1])
            setter(0, 2, rotated[2])
            setter(1, 2, rotated[3])
            setter(2, 2, rotated[4])
            setter(2, 1, rotated[5])
            setter(2, 0, rotated[6])
            setter(1, 0, rotated[7])
        }

        plane.flat(1).forEach(cube => {
            cube.transformSides(axisName, angle)
            cube.rotate(axis, angle)
        })
    }


    public addTurnEventListener(listener: (event: TurnEvent) => void) {
        this._listeners.add(listener)
    }

    public removeTurnEventListener(listener: (event: TurnEvent) => void) {
        this._listeners.delete(listener)
    }

    private _dispatchTurnEvent(axis: Axis, index: number, angle: number) {
        const event: TurnEvent = {axis, index, angle}
        this._listeners.forEach(listener => listener(event))
    }
}

export {
    Rubics
}