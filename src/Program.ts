class Program {
    private program: WebGLProgram
    private uniformMap: Map<string, WebGLUniformLocation>

    public constructor(
        private path: string,
        vertexShaderSource: string,
        fragmentShaderSource: string,
        private gl: WebGL2RenderingContext
    ) {
        const vertexShader = this.createShader(vertexShaderSource, this.gl.VERTEX_SHADER, 'vertex')
        const fragmentShader = this.createShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER, 'fragment')

        const p = this.gl.createProgram()
        
        if (!p)
            throw new Error('Fatal: webgl could not create program object!')

        this.program = p
        this.gl.attachShader(this.program, vertexShader)
        this.gl.attachShader(this.program, fragmentShader)
        this.gl.linkProgram(this.program)
        const success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
        if (!success) {            
            const info = this.gl.getProgramInfoLog(this.program)
            this.gl.deleteProgram(this.program)
            throw new Error(`Link Program: ${info}`)
        }

        const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS) as number
        const uniformIndices = [...Array(numUniforms).keys()]
        const uniformNames = uniformIndices.map(index => {
            const info = this.gl.getActiveUniform(this.program, index)
            const location = this.gl.getUniformLocation(this.program, info!.name)!
            return [info!.name, location] as const
        })
        this.uniformMap = new Map(uniformNames)
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

    public use() {
        if (!this.program)
            throw new Error('Fatal: program does not exists!')
        this.gl.useProgram(this.program)
    }

    public uniform(name: string, u: Uniform) {
        if (!this.uniformMap.has(name))
            throw new Error(`Fatal: unkown name: ${name}`)
        const location = this.uniformMap.get(name)!
        u.setUniform(this.gl, location)
    }
}

interface Uniform {
    setUniform(gl: WebGL2RenderingContext, location: WebGLUniformLocation): void
}


export {
    Program,
    Uniform
}