var FS_OrenNayar = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
//in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;
uniform float p;
uniform float sigma;


struct Light{
  vec4 posL;
  vec4 dirL;
  float limit;
  vec3 ia;
  int type;
};


uniform Light lights[10];

vec3 calcularAporteSpot(Light l, vec3 N, vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  //OREN-NAYAR
    //vec3 v = normalize(-L-N*dot(N,L) );
    //vec3 u = normalize(-V-N * dot(N,V));
    //float phiDiff = max(dot(u,v),0.0);
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = ka;
  float f0N = 0.0;
  if(max(dot(S,-L),0.0) > limit){
    float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
    float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
    float cosR = max(dot(N,V),0.0);
    float cosI = max(dot(N,L),0.0);
    float anguloR = acos(cosR);
    float anguloI = acos(cosI);
    float a = max(anguloR,anguloI);
    float b = min(anguloR,anguloI);
    //f0N = (p/PI )* cosI*(A+B*max(0.0,phiDiff)*sin(a)*tan(b));
    float cosPHI = dot( normalize(V-N*(cosR)), normalize(L - N*(cosI)) );
    f0N = (p/PI)*cosI*(A+(B*max(0.0,cosPHI))*sin(a)*tan(b));
	  toReturn = ka +kd * ia* f0N;
  }
  return toReturn;
}

vec3 calcularAportePuntual(Light l, vec3 N, vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  //vec3 S = normalize(vec3(dirL));
  vec3 toReturn = ka;
  float f0N = 0.0;
  float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
  float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
  float cosR = max(dot(N,V),0.0);
  float cosI = max(dot(N,L),0.0);
  float anguloR = acos(cosR);
  float anguloI = acos(cosI);
  float a = max(anguloR,anguloI);
  float b = min(anguloR,anguloI);
  //f0N = (p/PI )* cosI*(A+B*max(0.0,phiDiff)*sin(a)*tan(b));
  float cosPHI = dot( normalize(V-N*(cosR)), normalize(L - N*(cosI)) );
  f0N = (p/PI)*cosI*(A+(B*max(0.0,cosPHI))*sin(a)*tan(b));
  toReturn = ka +kd * ia* f0N;
  return toReturn;
}

vec3 calcularAporteDireccional(Light l, vec3 N, vec3 V){
  vec4 posL = l.posL;
  vec4 dirL = l.dirL;
  vec3 ia = l.ia;
  float limit = l.limit;
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 S = normalize(vec3(dirL));
  vec3 H = normalize(V+S);

  vec3 toReturn = ka;
  float f0N = 0.0;
  float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
  float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
  float cosR = max(dot(N,V),0.0);
  float cosI = max(dot(N,S),0.0);
  float anguloR = acos(cosR);
  float anguloI = acos(cosI);
  float a = max(anguloR,anguloI);
  float b = min(anguloR,anguloI);
  //f0N = (p/PI )* cosI*(A+B*max(0.0,phiDiff)*sin(a)*tan(b));
  float cosPHI = dot( normalize(V-N*(cosR)), normalize(S - N*(cosI)) );
  f0N = (p/PI)*cosI*(A+(B*max(0.0,cosPHI))*sin(a)*tan(b));
  toReturn = ka +kd * ia* f0N;
  return toReturn;
}


void main(){
    vec3 N = normalize(vNE);
    //vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    //vec3 H = normalize(L+V);
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

}`
