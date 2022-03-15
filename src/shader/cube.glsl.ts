const vertex = `#version 300 es

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;

out vec3 Normal;
out vec3 FragPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(aPos, 1.0);
    FragPos = vec3(model * vec4(aPos, 1.0));
    Normal = mat3(transpose(inverse(model))) * aNormal;
}`

const fragment = `#version 300 es

precision mediump float;

in vec3 Normal;
in vec3 FragPos;

out vec4 FragColor;

struct DirectionalLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform float shininess;
uniform vec3 color;
uniform DirectionalLight light;

uniform vec3 viewPos;

void main()
{
    vec3 ambient = light.ambient * color;

    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(-light.direction);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * color;

    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = light.specular * spec * color;

    vec3 result = ambient + diffuse + specular;
    FragColor = vec4(result, 1.0);
}`

export {
    vertex,
    fragment
}