const vertexRegex = /(?<=#Vertex\r?\n)([\w\W]*?)(?=#Fragment|$)/
const fragmentRegex = /(?<=#Fragment\r?\n)([\w\W]*?)(?=#Vertex|$)/

class Program {
    private program: WebGLProgram | null = null

    public constructor(private path: string, private gl: WebGL2RenderingContext) {}

    public async compileAndLinkPorgram() {
        const data = await fetch(this.path)
        const shaderStr = await data.text()
        const vertexShaderMatch = shaderStr.match(vertexRegex)
        const fragmentShaderMatch = shaderStr.match(fragmentRegex)
        if (!vertexShaderMatch?.length)
            throw new Error(`No vertex shader defined in '${this.path}'. Make sure to write '#Vertex' before your vertex shader`)
        if (!fragmentShaderMatch?.length)
            throw new Error(`No fragment shader defined in '${this.path}'. Make sure to write '#Fragment' before your fragment shader`)

        const vertexShaderSource = vertexShaderMatch[0]
        const fragmentShaderSource = fragmentShaderMatch[0]

        const vertexShader = this.createShader(vertexShaderSource, this.gl.VERTEX_SHADER, 'vertex')
        const fragmentShader = this.createShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER, 'fragment')

        this.program = this.gl.createProgram()
        if (!this.program)
            throw new Error('Fatal: webgl could not create program object!')

        this.gl.attachShader(this.program, vertexShader)
        this.gl.attachShader(this.program, fragmentShader)
        this.gl.linkProgram(this.program)
        const success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
        if (success)
            return
        
        const info = this.gl.getProgramInfoLog(this.program)
        this.gl.deleteProgram(this.program)
        this.program = null
        throw new Error(`Link Program: ${info}`)
    }

    private createShader(source: string, type: number, typeStr: string) {
        const shader = this.gl.createShader(type)
        if (!shader)
            throw new Error('Fatal: webgl could not create shader object!')
        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)
        
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) as boolean
        if (success)
            return shader
        
        const info = this.gl.getShaderInfoLog(shader)
        this.gl.deleteShader(shader)
        throw new Error(`Compile '${this.path}': ${typeStr}: ${info}`)
    }
}

export {
    Program
}