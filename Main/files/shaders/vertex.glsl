// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderSource = `#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;
uniform mat4 MV;


in vec3 vertexPosition;
in vec3 vertexNormal;

out vec3 vNE; //Vector normal en espacio ojo
out vec3 vLE; //Vector de direccion de luz
out vec3 vVE; //Vector de vista (al ojo)

uniform vec4 posL; //Posicion luz
void main(void){
    //mat4 MV =  viewMatrix * modelMatrix;
    gl_Position = projectionMatrix * MV * vec4(vertexPosition, 1.0);

    vec3 posVE = vec3(MV*vec4(vertexPosition,1.0));
    vLE = normalize(vec3(posL-vec4(posVE,1.0)));

    mat4 MN = normalMatrix;
    //Transformar normal del espacio objeto al ojo
    vNE = normalize(vec3(MN * vec4(vertexNormal,0.0)));

    //Calcular el vector del ojo en espacio del ojo; el ojo, por def esta en el origen.
    vVE= normalize(-posVE);



}
`
