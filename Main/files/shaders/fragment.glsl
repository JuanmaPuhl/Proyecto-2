var fragmentShaderSource = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec3 ka;
uniform float coefEspec;
uniform vec3 kd;
uniform vec3 ks;
uniform float F0;
uniform vec3 ia;
uniform float rugosidad;
//uniform vec4 pd;
//uniform vec4 ps;
//uniform float ax;
//uniform float ay;
uniform float limit;
uniform vec4 dirL;
uniform float p;
uniform float sigma;

float orenNayar(){

  vec3 N = normalize(vNE);
  vec3 L = normalize(vLE);
  vec3 V = normalize(vVE);
  vec3 H = normalize(L+V);

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
  return f0N;
}


void main(){
    float PHI =3.141516;
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);

    //Calculo termino difuso + espec de Blinn-Phong
    vec3 direccion = normalize(vec3(dirL));
    vec3 H = normalize(L+V);
    // float difuso = max(dot(L,N),0.0) ;
    // float specBlinnPhong = pow(max(dot(N,H),0.0),coefEspec);
    // if(dot(L,N)< 0.0){
    //     specBlinnPhong = 0.0;
    // }

    float F0N=orenNayar();


    float titaH = max(dot(N,H),0.0);
    float titaI = max(dot(N,L),0.0);
    //Variables de la atenuacion geometrica

    float Beckmann;

    //Termino de Fresnel
    //float F0 = 0.713;
    float Fres = pow(1.0 - titaH, 5.0);
    Fres *= (1.0 - F0);
	  Fres += F0;

    //Termino de Beackmann
 	//float coeficienteA = 0.214187;
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
    if(componente1*componente2!=0.0)
		  colorFrag = vec4(ka +ia*(kd*F0N +ks*(Fres/3.141516)* (Beckmann*GCT)/(componente1*componente2)),1.0);
	  else
	     colorFrag = vec4(ka+ia*kd*F0N,1.0);
//colorFrag = ka+kd*difuso+ks*specBlinnPhong;
}`
