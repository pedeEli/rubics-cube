import {Uniform} from './Program'

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
abstract class Vector<V> {
    public abstract scale(a: number): V
    public abstract add(v: V): V
    public abstract sub(v: V): V
    public abstract mult(v: V): V
    public abstract dot(v: V): number
    public abstract toArray(): number[]

    public get squareMag() {
        return this.dot(this)
    }
    public get mag() {
        return Math.sqrt(this.squareMag)
    }
    public get normalized() {
        return this.scale(1 / this.mag)
    }
    public get negate() {
        return this.scale(-1)
    }
}
class V3 extends Vector<V3> implements Uniform {
    public constructor(public x: number, public y: number, public z: number) {
        super()
    }
    public scale(a: number) {
        return new V3(a * this.x, a * this.y, a * this.z)
    }
    public add({x, y, z}: V3) {
        return new V3(this.x + x, this.y + y, this.z + z)
    }
    public sub({x, y, z}: V3) {
        return new V3(this.x - x, this.y - y, this.z - z)
    }
    public mult({x, y, z}: V3) {
        return new V3(this.x * x, this.y * y, this.z * z)
    }
    public cross({x, y, z}: V3) {
        return new V3(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x)
    }
    public dot({x, y, z}: V3) {
        return this.x * x + this.y * y + this.z * z
    }
    public toArray() {
        return [this.x, this.y, this.z]
    }
    public setUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation): void {
        gl.uniform3f(location, this.x, this.y, this.z)
    }

    public static get zero() {
        return new V3(0, 0, 0)
    }
    public static get one() {
        return new V3(1, 1, 1)
    }
    public static get up() {
        return new V3(0, 1, 0)
    }
    public static get down() {
        return new V3(0, -1, 0)
    }
    public static get left() {
        return new V3(1, 0, 0)
    }
    public static get right() {
        return new V3(-1, 0, 0)
    }
    public static get forward() {
        return new V3(0, 0, 1)
    }
    public static get back() {
        return new V3(0, 0, -1)
    }

}
class V4 extends Vector<V4> implements Uniform {
    public constructor(public x: number, public y: number, public z: number, public w: number) {
        super()
    }
    public scale(a: number) {
        return new V4(a * this.x, a * this.y, a * this.z, a * this.w)
    }
    public add({x, y, z, w}: V4) {
        return new V4(this.x + x, this.y + y, this.z + z, this.w + w)
    }
    public sub({x, y, z, w}: V4) {
        return new V4(this.x - x, this.y - y, this.z - z, this.w - w)
    }
    public mult({x, y, z, w}: V4) {
        return new V4(this.x * x, this.y * y, this.z * z, this.w * w)
    }
    public dot({x, y, z, w}: V4) {
        return this.x * x + this.y * y + this.z * z + this.w * w
    }
    public toV3() {
        return new V3(this.x, this.y, this.z)
    }
    public toArray() {
        return [this.x, this.y, this.z, this.w]
    }
    public setUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation): void {
        gl.uniform4f(location, this.x, this.y, this.z, this.w)
    }
}

abstract class Matrix<M, V> {
    public abstract scale(a: number): M
    public abstract add(m: M): M
    public abstract sub(m: M): M
    public abstract mult(m: M): M
    public abstract mult(v: V): V
    public abstract toArray(): number[]
    public abstract get transpose(): M
    public abstract get inverse(): M
    public static abstract get identity(): M
}

class M44 extends Matrix<M44, V4> implements Uniform {
    public constructor(public r1: V4, public r2: V4, public r3: V4, public r4: V4) {
        super()
    }
    public scale(a: number) {
        return new M44(this.r1.scale(a), this.r2.scale(a), this.r3.scale(a), this.r4.scale(a))
    }
    public add({r1, r2, r3, r4}: M44) {
        return new M44(this.r1.add(r1), this.r2.add(r2), this.r3.add(r3), this.r4.add(r4))
    }
    public sub({r1, r2, r3, r4}: M44) {
        return new M44(this.r1.sub(r1), this.r2.sub(r2), this.r3.sub(r3), this.r4.sub(r4))
    }
    public mult(m: M44): M44
    public mult(v: V4): V4
    public mult(m) {
        if (m.x !== undefined) {
            return new V4(
                this.r1.dot(m),
                this.r2.dot(m),
                this.r3.dot(m),
                this.r4.dot(m)
            )
        }
        return new M44(
            new V4(this.r1.dot(m.c1), this.r1.dot(m.c2), this.r1.dot(m.c3), this.r1.dot(m.c4)),
            new V4(this.r2.dot(m.c1), this.r2.dot(m.c2), this.r2.dot(m.c3), this.r2.dot(m.c4)),
            new V4(this.r3.dot(m.c1), this.r3.dot(m.c2), this.r3.dot(m.c3), this.r3.dot(m.c4)),
            new V4(this.r4.dot(m.c1), this.r4.dot(m.c2), this.r4.dot(m.c3), this.r4.dot(m.c4))
        )
    }
    public toArray() {
        return [...this.r1.toArray(), ...this.r2.toArray(), ...this.r3.toArray(), ...this.r4.toArray()]
    }
    public static get identity() {
        return new M44(
            new V4(1, 0, 0, 0),
            new V4(0, 1, 0, 0),
            new V4(0, 0, 1, 0),
            new V4(0, 0, 0, 1)
        )
    }


    public get c1() {
        return new V4(this.r1.x, this.r2.x, this.r3.x, this.r4.x)
    }
    public get c2() {
        return new V4(this.r1.y, this.r2.y, this.r3.y, this.r4.y)
    }
    public get c3() {
        return new V4(this.r1.z, this.r2.z, this.r3.z, this.r4.z)
    }
    public get c4() {
        return new V4(this.r1.w, this.r2.w, this.r3.w, this.r4.w)
    }

    public setUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
        const data = new Float32Array(this.toArray())
        gl.uniformMatrix4fv(location, true, data)
    }

    public get transpose() {
        return new M44(this.c1, this.c2, this.c3, this.c4)
    }

    public get inverse() {
        const [i00, i01, i02, i03] = this.r1.toArray()
        const [i10, i11, i12, i13] = this.r2.toArray()
        const [i20, i21, i22, i23] = this.r3.toArray()
        const [i30, i31, i32, i33] = this.r4.toArray()

        const s0 = i00 * i11 - i10 * i01
        const s1 = i00 * i12 - i10 * i02
        const s2 = i00 * i13 - i10 * i03
        const s3 = i01 * i12 - i11 * i02
        const s4 = i01 * i13 - i11 * i03
        const s5 = i02 * i13 - i12 * i03
        const c5 = i22 * i33 - i32 * i23
        const c4 = i21 * i33 - i31 * i23
        const c3 = i21 * i32 - i31 * i22
        const c2 = i20 * i33 - i30 * i23
        const c1 = i20 * i32 - i30 * i22
        const c0 = i20 * i31 - i30 * i21
        const det = s0 * c5 - s1 * c4 + s2 * c3 + s3 * c2 - s4 * c1 + s5 * c0
        const invDet = 1 / det
        return new M44(
            new V4(
                (i11 * c5 - i12 * c4 + i13 * c3),
                (-i01 * c5 + i02 * c4 - i03 * c3),
                (i31 * s5 - i32 * s4 + i33 * s3),
                (-i21 * s5 + i22 * s4 - i23 * s3)
            ),
            new V4(
                (-i10 * c5 + i12 * c2 - i13 * c1),
                (i00 * c5 - i02 * c2 + i03 * c1),
                (-i30 * s5 + i32 * s2 - i33 * s1),
                (i20 * s5 - i22 * s2 + i23 * s1)
            ),
            new V4(
                (i10 * c4 - i11 * c2 + i13 * c0),
                (-i00 * c4 + i01 * c2 - i03 * c0),
                (i30 * s4 - i31 * s2 + i33 * s0),
                (-i20 * s4 + i21 * s2 - i23 * s0)
            ),
            new V4(
                (-i10 * c3 + i11 * c1 - i12 * c0),
                (i00 * c3 - i01 * c1 + i02 * c0),
                (-i30 * s3 + i31 * s1 - i32 * s0),
                (i20 * s3 - i21 * s1 + i22 * s0)
            )
        ).scale(invDet)
    }
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

class Quaternion {
    public constructor(public real: number, public im: V3) {}

    public static fromAngle(axis: V3, angle: number, degree = true) {
        if (degree)
            angle *= Math.PI / 180
        const half = angle / 2;
        const real = Math.cos(half)
        const im = axis.normalized.scale(Math.sin(half))
        return new Quaternion(real, im)
    }
    public get matrix() {
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
        return new M44(
            new V4(1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0),
            new V4(2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0),
            new V4(2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0),
            new V4(            0,             0,                 0, 1)
        )
    }
    public mult({real, im}: Quaternion) {
        return new Quaternion(this.real * real - this.im.dot(im), this.im.cross(im).add(im.scale(this.real)).add(this.im.scale(real)))
    }
    public rotate(v: V3) {
        return new Quaternion(this.real, this.im.negate).mult(new Quaternion(0, v)).mult(this).im
    }

    public static get identity() {
        return new Quaternion(1, V3.zero)
    }
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
    V4,
    V3,
    lookAt,
    Quaternion,
    M44,
    makeTransform
}