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
    return [
        x,  0,  0,  0,
        0,  y,  0,  0,
        0,  0,  z,  w,
        0,  0, -1,  0]
}

class V3 {
    public constructor(public x: number, public y: number, public z: number) {}

    public mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    public scale(a: number) {
        return new V3(a * this.x, a * this.y, a * this.z)
    }

    public get normalized() {
        const mag = this.mag()
        return this.scale(1 / mag)
    }

    public add({x, y, z}: V3) {
        return new V3(this.x + x, this.y + y, this.z + z)
    }

    public sub({x, y, z}: V3) {
        return new V3(this.x - x, this.y - y, this.z - z)
    }

    public cross({x, y, z}: V3) {
        return new V3(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x)
    }

    public dot({x, y, z}: V3) {
        return this.x * x + this.y * y + this.z * z
    }
}

const lookAt = (eye: V3, center: V3, up: V3) => {
    const za = center.sub(eye).normalized
    const xa = za.cross(up).normalized
    const ya = xa.cross(za)
    const xd = -xa.dot(eye)
    const yd = -ya.dot(eye)
    const zd = za.dot(eye)
    return [
         xa.x,  xa.y,  xa.z,  xd,
         ya.x,  ya.y,  ya.z,  yd,
        -za.x, -za.y, -za.z,  zd,
             0,    0,     0,   1]
}

class Quaternion {
    public constructor(public real: number, public im: V3) {}

    public static fromAngle(axis: V3, angle: number) {
        const half = angle / 2;
        const real = Math.cos(half)
        const im = axis.normalized.scale(Math.sin(half))
        return new Quaternion(real, im)
    }

    public toMatrix() {
        const {x, y, z} = this.im
        const w = this.real
        const xx = x * x
        const yy = y * y
        const zz = z * z
        const xy = x * y
        const xz = x * z
        const xw = x * w
        const yz = y * z
        const yw = y * w
        const zw = z * w
        return [
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
            0            , 0            , 0                , 1]
    }
}

export {
    perspective,
    V3,
    lookAt,
    Quaternion
}