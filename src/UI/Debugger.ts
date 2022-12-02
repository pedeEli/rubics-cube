import {V2} from '@Math/Vector'

class Debugger {
    private _canvas: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D

    private _strokeColor = 'white'

    public constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        const ctx = canvas.getContext('2d')
        if (!ctx)
            throw new Error('Fatal: Cannot create 2d context of canvas!')
        this._ctx = ctx
    }

    public clear() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }

    public stroke(color: string) {
        this._strokeColor = color
    }

    public line(from: V2, to: V2) {
        this._ctx.strokeStyle = this._strokeColor
        this._ctx.lineWidth = 3
        const fromF = this._flipVector(from)
        const toF = this._flipVector(to)
        this._ctx.beginPath()
        this._ctx.moveTo(fromF.x, fromF.y)
        this._ctx.lineTo(toF.x, toF.y)
        this._ctx.stroke()
    }

    public vector(origin: V2, direction: V2, length: number = 1) {
        this.line(origin, origin.add(direction.scale(length)))
    }

    public setSize(width: number, height: number) {
        this._canvas.width = width
        this._canvas.height = height
    }

    private _flipVector({x, y}: V2) {
        return new V2(x, this._canvas.height - y)
    }
}

const debug = new Debugger(document.querySelector('[data-debug]')!)

export {
    debug
}