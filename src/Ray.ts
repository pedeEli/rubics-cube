import {Camera} from './Camera'
import {V3, V4, M44} from './Math'
import {Rubics} from './Rubics'
import {Cube} from './Cube'
import {Plane} from './Plane'

class Ray {
    private origin: V3
    private direction: V3

    public constructor(camera: Camera, x: number, y: number, width: number, height: number) {
        const u = (x + .5) / width * 2 - 1
        const v = (height - y + .5) / height * 2 - 1
        this.origin = camera.cameraToWorldMatrix.mult(new V4(0, 0, 0, 1)).toV3()

        const d1 = camera.projectionMatrixInverse.mult(new V4(u, v, 0, 1))
        const d2 = camera.cameraToWorldMatrix.mult(new V4(d1.x, d1.y, d1.z, 0))
        this.direction = d2.toV3().normalized
    }

    public intersectRubics(rubics: Rubics) {
        rubics.cubes.forEach(cube => {
            this.intersectCube(cube, rubics.transform)
        })
    }

    private intersectCube(cube: Cube, rubicsTransform: M44) {
        const transform = rubicsTransform.mult(cube.transform)
        cube.planes.forEach(plane => {
            plane.intersects = this.intersectPlane(plane, transform)
        })
    }
    public intersectPlane(plane: Plane, cubeTransform: M44) {
        const transform = cubeTransform.mult(plane.transform)
        const positionTopLeft = transform.mult(new V4(.5, .5, 0, 1)).toV3()
        const positionBottomRight = transform.mult(new V4(-.5, -.5, 0, 1)).toV3()

        const temp = transform.inverse.transpose

        const left = temp.mult(new V4(0, -1, 0, 1)).toV3().normalized
        const top = temp.mult(new V4(-1, 0, 0, 1)).toV3().normalized
        const normal = temp.mult(new V4(0, 0, -1, 1)).toV3().normalized

        // console.log({positionTopLeft, positionBottomRight, left, top, normal})

        const denom = this.direction.dot(normal)
        if (denom === 0)
            return false
        
        const d = positionTopLeft.sub(this.origin).dot(normal) / denom
        const intersection = this.origin.add(this.direction.scale(d))
        const fromTopLeft = intersection.sub(positionTopLeft).normalized
        const fromBottomRight = intersection.sub(positionBottomRight).normalized

        // console.log({d, intersection, fromTopLeft, fromBottomRight})

        const dot1 = fromTopLeft.dot(left)
        const dot2 = fromTopLeft.dot(top)
        const dot3 = fromBottomRight.dot(left.negate)
        const dot4 = fromBottomRight.dot(top.negate)
        return dot1 <= 1 && dot1 >= 0
            && dot2 <= 1 && dot2 >= 0
            && dot3 <= 1 && dot3 >= 0
            && dot4 <= 1 && dot4 >= 0
    }
}

export {
    Ray
}