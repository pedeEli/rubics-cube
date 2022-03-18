import {Transform} from '@GameObjects/Transform'
import {Program} from '../Program'

interface GameObject {
    transform: Transform
    render?: (program: Program, gl: WebGL2RenderingContext) => void
    update?: (delta: number) => void
}

export {
    GameObject
}