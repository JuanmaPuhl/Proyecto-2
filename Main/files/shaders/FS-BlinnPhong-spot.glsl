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
in vec2 fTexCoor;
uniform sampler2D imagen;

struct Light{
  vec4 posL;
  vec4 dirL;
  float limit;
  vec3 ia;
  int type;
};


uniform Light lights[10];

out vec4 colorFrag;

vec3 calcularAporteSpot(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
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
  return ka+mix(kd,texture(imagen,fTexCoor).rgb,0.5)*diffuse+ks*specular;
}

vec3 calcularAportePuntual(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
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

  return ka+mix(kd,texture(imagen,fTexCoor).rgb,0.5)*diffuse+ks*specular;
}

vec3 calcularAporteDireccional(Light l, vec3 N , vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 S = normalize(vec3(dirL));
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+S);


  float diffuse = 0.0;
  float specular = 0.0;

  diffuse = max(dot(S,N),0.0);
  specular = pow(max(dot(N,H),0.0),coefEspec);
  if (dot(S,N) < 0.0){
      specular = 0.0;
  }

  return ka+ mix(kd,texture(imagen,fTexCoor).rgb,0.5)*diffuse+ks*specular;
}

void main()
{
    vec3 N = normalize(vNE);
    //vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    colorFrag = vec4(0.0);
    int cant = lights.length();
    for(int i = 0; i<cant; i++){
      if(lights[i].type==0)
        colorFrag += vec4(calcularAporteSpot(lights[i],N,V),1.0);
      if(lights[i].type==1)
        colorFrag += vec4(calcularAportePuntual(lights[i],N,V),1.0);
      if(lights[i].type==2)
        colorFrag += vec4(calcularAporteDireccional(lights[i],N,V),1.0);
    }
    colorFrag = colorFrag ;

}
`
