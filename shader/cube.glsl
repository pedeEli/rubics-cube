#Vertex
#version 300 es

layout (location = 0) in vec3 position;

void main()
{
    gl_Position = vec4(position, 1.0);
}

#Fragment
#version 300 es

precision mediump float;
out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0);
}