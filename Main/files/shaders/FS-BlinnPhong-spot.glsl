// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var FS_BlinnPhong_spot =`#version 300 es
//Modelo de iluminacion de Blinn-Phong
//Implementado en los fragmentos (sombreado de Phong)
precision highp float;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float coefEspec;
uniform mat4 viewMatrix;


in vec3 vNE; //Normal del vertice en coordenadas del ojo
//in vec3 vLE; //Direccion de la luz al vertice en coordenadas del ojo
in vec3 vVE; //Direccion del ojo al vertice en coordenadas del ojo
//in vec3 vSD; //Direccion del spot


//Light 1
uniform vec4 posL1;
uniform vec4 dirL1;
uniform vec3 ia1;
uniform float limit1; //coseno del angulo

//Light 2
uniform vec4 posL2;
uniform vec4 dirL2;
uniform vec3 ia2;
uniform float limit2; //coseno del angulo

out vec4 fragColor;

vec3 calcularAporteSpot(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N , vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));


  float diffuse = 0.0;
  float specular = 0.0;
  if(max(dot(S,-L),0.0) > limit){
      diffuse = max(dot(L,N),0.0);
      specular = pow(max(dot(N,H),0.0),coefEspec);
      if (dot(L,N) < 0.0){
          specular = 0.0;
      }
  }
  return ka+kd*diffuse+ks*specular;
}

vec3 calcularAportePuntual(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N , vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  //vec3 S = normalize(vec3(dirL));

  float diffuse = 0.0;
  float specular = 0.0;

  diffuse = max(dot(L,N),0.0);
  specular = pow(max(dot(N,H),0.0),coefEspec);
  if (dot(L,N) < 0.0){
      specular = 0.0;
  }

  return ka+kd*diffuse+ks*specular;
}

void main()
{
    vec3 N = normalize(vNE);
    //vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    //vec3 H = normalize(L+V);
    //vec3 S = normalize(vSD);
    // float diffuse = 0.0;
    // float specular = 0.0;
    // if(max(dot(S,-L),0.0) > limit){
    //     diffuse = max(dot(L,N),0.0);
    //     specular = pow(max(dot(N,H),0.0),coefEspec);
    //     if (dot(L,N) < 0.0){
    //         specular = 0.0;
    //     }
    // }
    //float fac_att = pow(0.2*length(vLE),-1.0); //factor de atenuacion
    float fac_att = 1.0;

    fragColor = vec4(calcularAporteSpot(posL1,dirL1,ia1,limit1,N,V) + calcularAportePuntual(posL2,dirL2,ia2,limit2,N,V) ,1.0);

}
`
