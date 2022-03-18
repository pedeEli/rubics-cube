const vertex = `#version 300 es

layout (location = 0) in vec3 aPos;

out vec2 pos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    pos = aPos.xy;
}`

const fragment = `#version 300 es

precision mediump float;

in vec2 pos;

out vec4 FragColor;

uniform vec3 color;

void main()
{
    if (abs(pos.x) > 0.45 || abs(pos.y) > 0.45) {
        FragColor = vec4(vec3(0.07), 1.0);
        return;
    }
    FragColor = vec4(color, 1.0);
}`

export {
    vertex,
    fragment
}