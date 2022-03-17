const vertex = `#version 300 es

layout (location = 0) in vec3 aPos;

out vec3 FragPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    FragPos = vec3(model * vec4(aPos, 1.0));
}`

const fragment = `#version 300 es

precision mediump float;

in vec3 FragPos;

out vec4 FragColor;

uniform vec3 color;
uniform int intersects;

void main()
{
    if (intersects == 1) {
        FragColor = vec4(vec3(0.0), 1.0);
    } else {
        FragColor = vec4(color, 1.0);
    }
}`

export {
    vertex,
    fragment
}