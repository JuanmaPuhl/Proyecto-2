// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var FS_BlinnPhong_spot =`#version 300 es
//Modelo de iluminacion de Blinn-Phong
//Implementado en los fragmentos (sombreado de Phong)
precision highp float;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float coefEspec;
uniform vec3 ia;
uniform float limit; //coseno del angulo

in vec3 vNE; //Normal del vertice en coordenadas del ojo
in vec3 vLE; //Direccion de la luz al vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo
in vec3 vSD; //Direccion del spot

out vec4 fragColor;

void main()
{
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    vec3 S = normalize(vSD);
    float diffuse = 0.0;
    float specular = 0.0;
    if(max(dot(S,-L),0.0) > limit){
        diffuse = max(dot(L,N),0.0);
        specular = pow(max(dot(N,H),0.0),coefEspec);
        if (dot(L,N) < 0.0){
            specular = 0.0;
        }
    }
    //float fac_att = pow(0.2*length(vLE),-1.0); //factor de atenuacion
    float fac_att = 1.0;

    fragColor = vec4(ka + ia * fac_att * (kd * diffuse + ks * specular),1.0);

}
`
