import {V3, V4} from './Vector'
import {M44} from './Matrix'
import {Quaternion} from './Quarternion'

const perspective = (fovy: number, aspect: number, near: number, far: number) => {
    const tanHalfFovy = Math.tan(fovy / 2)
    const x = 1 / (aspect * tanHalfFovy)
    const y = 1 / tanHalfFovy
    const fpn = far + near
    const fmn = far - near
    const oon = .5 / near
    const oof = .5 / far
    const z = -fpn / fmn
    const w = 1 / (oof - oon)
    return new M44(
        new V4(x,  0,  0,  0),
        new V4(0,  y,  0,  0),
        new V4(0,  0,  z,  w),
        new V4(0,  0, -1,  0)
    )
}

const lookAt = (eye: V3, center: V3, up: V3) => {
    const za = center.sub(eye).normalized
    const xa = za.cross(up).normalized
    const ya = xa.cross(za)
    const xd = -xa.dot(eye)
    const yd = -ya.dot(eye)
    const zd = za.dot(eye)
    return new M44(
        new V4( xa.x,  xa.y,  xa.z,  xd),
        new V4( ya.x,  ya.y,  ya.z,  yd),
        new V4(-za.x, -za.y, -za.z,  zd),
        new V4(    0,     0,     0,   1)
    )
}

const makeTransform = ({x, y, z}: V3, rotation: Quaternion) => {
    const transform = rotation.matrix
    transform.r1.w = x
    transform.r2.w = y
    transform.r3.w = z
    return transform
}

export {
    perspective,
    lookAt,
    makeTransform
}