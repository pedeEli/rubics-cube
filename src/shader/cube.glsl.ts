const vertex = `#version 300 es

layout (location = 0) in vec3 position;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0);
}`

const fragment = `#version 300 es

precision mediump float;
out vec4 FragColor;

void main()
{
    FragColor = vec4(1.0);
}`

export {
    vertex,
    fragment
}