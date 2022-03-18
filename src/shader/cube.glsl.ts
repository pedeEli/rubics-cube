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

vec3 rime = vec3(0.07);
float outer = 0.45;
float inner = 0.44;

float map(float value, float min1, float max1, float min2, float max2)
{
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main()
{
    float x = abs(pos.x);
    float y = abs(pos.y);
    if (x > outer || y > outer) {
        FragColor = vec4(rime, 1.0);
        return;
    }
    if (x > inner || y > inner) {
        float t = smoothstep(0.0, 1.0, map(max(x, y), outer, inner, 0.0, 1.0));
        vec3 c = color * t + rime * (1.0 - t);
        FragColor = vec4(c, 1.0);
        return;
    }
    FragColor = vec4(color, 1.0);
}`

export {
    vertex,
    fragment
}