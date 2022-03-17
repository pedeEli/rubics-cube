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
    public scale(a) {
        return new V3(a * this.x, a * this.y, a * this.z)
    }
    public add({x, y, z}) {
        return new V3(this.x + x, this.y + y, this.z + z)
    }
    public sub({x, y, z}) {
        return new V3(this.x - x, this.y - y, this.z - z)
    }
    public mult({x, y, z}) {
        return new V3(this.x * x, this.y * y, this.z * z)
    }
    public cross({x, y, z}: V3) {
        return new V3(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x)
    }
    public dot({x, y, z}) {
        return this.x * x + this.y * y + this.z * z
    }
    public toArray() {
        return [this.x, this.y, this.z]
    }
    public setUniform(gl, location) {
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
    public scale(a) {
        return new V4(a * this.x, a * this.y, a * this.z, a * this.w)
    }
    public add({x, y, z, w}) {
        return new V4(this.x + x, this.y + y, this.z + z, this.w + w)
    }
    public sub({x, y, z, w}) {
        return new V4(this.x - x, this.y - y, this.z - z, this.w - w)
    }
    public mult({x, y, z, w}) {
        return new V4(this.x * x, this.y * y, this.z * z, this.w * w)
    }
    public dot({x, y, z, w}) {
        return this.x * x + this.y * y + this.z * z + this.w * w
    }
    public toV3() {
        return new V3(this.x, this.y, this.z)
    }
    public toArray() {
        return [this.x, this.y, this.z, this.w]
    }
    public setUniform(gl, location) {
        gl.uniform4f(location, this.x, this.y, this.z, this.w)
    }
}


export {
    V3,
    V4
}