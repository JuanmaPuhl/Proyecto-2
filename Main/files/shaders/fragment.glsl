var fragmentShaderSource = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
//in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec3 ka;
uniform float coefEspec;
uniform vec3 kd;
uniform vec3 ks;
uniform float F0;
uniform mat4 viewMatrix;
uniform float rugosidad;
//uniform vec4 pd;
//uniform vec4 ps;
//uniform float ax;
//uniform float ay;
uniform float p;
uniform float sigma;

//Light 1
uniform vec4 posL;
uniform vec4 dirL;
uniform float limit;
uniform vec3 ia;

float orenNayar(vec3 N, vec3 V, vec3 L, vec3 H){
  float f0N = 0.0;

  float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
  float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
  float cosR = max(dot(N,V),0.0);
  float cosI = max(dot(N,L),0.0);
  float anguloR = acos(cosR);
  float anguloI = acos(cosI);
  float a = max(anguloR,anguloI);
  float b = min(anguloR,anguloI);
  float cosPHI = dot( normalize(V-N*(cosR)), normalize(L - N*(cosI)) );
  f0N = (p/PI)*cosI*(A+(B*max(0.0,cosPHI))*sin(a)*tan(b));
  return f0N;
}

vec3 calcularAportePuntual(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N , vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);

  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,L),0.0);
  //Variables de la atenuacion geometrica

  float Beckmann;
  //Termino de Fresnel
  float Fres = pow(1.0 - titaH, 5.0);
  Fres *= (1.0 - F0);
  Fres += F0;

  //Termino de Beackmann
  float divisor = pow(rugosidad,2.0)* pow(titaH,4.0);
  float exponente = -(pow(tan(acos(titaH))/rugosidad,2.0));
  exponente = exp(exponente);
  Beckmann = exponente/divisor;

  //Variables de la atenuacion geometrica
  float GCT;
  float Ge;
  float Gs;
  float titaV = max(dot(V,H),0.0);
  Ge = (2.0*titaH*titaV)/(titaV);
  Gs = (2.0*titaH*titaI)/(titaV);

  GCT=min(1.0,Ge);
  GCT=min(GCT,Gs);
  float componente1 = max(dot(N,V),0.0);
  float componente2 = max(dot(N,L),0.0);

  float value = orenNayar(N,V,L,H);
  if(componente1*componente2!=0.0)
    return ka+kd*value + ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2);
  else
     return ka+ia*kd * value;
}

vec3 calcularAporteSpot(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N, vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = ka;

  float titaH = max(dot(N,H),0.0);
  float titaI = max(dot(N,L),0.0);
  //Variables de la atenuacion geometrica
  if(max(dot(S,-L),0.0) > limit){
    float Beckmann;
    //Termino de Fresnel
    float Fres = pow(1.0 - titaH, 5.0);
    Fres *= (1.0 - F0);
    Fres += F0;

    //Termino de Beackmann
    float divisor = pow(rugosidad,2.0)* pow(titaH,4.0);
    float exponente = -(pow(tan(acos(titaH))/rugosidad,2.0));
    exponente = exp(exponente);
    Beckmann = exponente/divisor;

    //Variables de la atenuacion geometrica
    float GCT;
    float Ge;
    float Gs;
    float titaV = max(dot(V,H),0.0);
    Ge = (2.0*titaH*titaV)/(titaV);
    Gs = (2.0*titaH*titaI)/(titaV);

    GCT=min(1.0,Ge);
    GCT=min(GCT,Gs);
    float componente1 = max(dot(N,V),0.0);
    float componente2 = max(dot(N,L),0.0);

    float value = orenNayar(N,V,L,H);
    if(componente1*componente2!=0.0)
      toReturn = ka+kd*value + ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2);
    else
       toReturn = ka+ia*kd * value;
  }

    return toReturn;
}

void main(){
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);
    colorFrag = vec4(calcularAporteSpot(posL,dirL,ia,limit,N,V),1.0);
    //colorFrag = ka+kd*difuso+ks*specBlinnPhong;
}`
