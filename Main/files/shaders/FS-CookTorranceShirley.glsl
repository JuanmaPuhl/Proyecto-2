var FS_CookTorranceShirley =` #version 300 es
#define PHI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
//in vec3 vLE;
in vec3 vVE;

out vec4 colorFrag;

uniform vec3 ka;
uniform vec3 kd;
uniform vec3 ks;

uniform float coefEspec;


uniform float rugosidad; // Se usa en las funciones de microfacetas
uniform float F0;        //Se usa en las funciones de fresnel

uniform float Nu;
uniform float Nv;


//Light 1
uniform vec4 posL;
uniform vec4 dirL;
uniform float limit;
uniform vec3 ia;

//light2
uniform vec4 posL2;
uniform vec4 dirL2;
uniform float limit2;
uniform vec3 ia2;

//light3
uniform vec4 posL3;
uniform vec4 dirL3;
uniform float limit3;
uniform vec3 ia3;

vec3 calcularAporteSpot(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N, vec3 V){
  //Calculo termino difuso + espec de Blinn-Phong
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = ka;
  if(max(dot(S,-L),0.0) > limit){
    float difusoBlPh = max(dot(L,N),0.0) ;
    float specBlPh = pow(max(dot(N,H),0.0),coefEspec);

    if(dot(L,N)< 0.0){
      specBlPh = 0.0;
    }

    // Producto escalar
    float NdotH = max(dot(N,H),0.000001);
    float NdotL = max(dot(N,L),0.000001);
    float VdotH = max(dot(V,H),0.000001);
    float NdotV = max (dot(N,V),0.00001);
    float HdotL = max (dot(H,L),0.00001);

    //Termino de Fresnel segun Schlick

    float Schlick = pow(1.0 - NdotH, 5.0);
    Schlick *= (1.0 - F0);
    Schlick += F0;

    //Termino de Fresnel segun Schlick
    float terminoN = (1.0+sqrt(F0))/(1.0-sqrt(F0));
    float terminoC = max(dot(V,H),0.0);
    float terminoG = sqrt( pow(terminoN,2.0) + pow(terminoC,2.0) -1.0);
    float CK1T = pow( (terminoG-terminoC)/(terminoG+terminoC) ,2.0) * 0.5;
    float CK2T = (1.0 + pow( ( (terminoG + terminoC)*terminoC -1.0 )/((terminoG - terminoC)*terminoC + 1.0 ),2.0));
    float CK = CK1T*CK2T;

    // Coeficiente especular de Ashikhmin-Shirley
    float Divisor = 8.0*PHI*HdotL * max(NdotV,NdotL);
    float AshShiExp = Nu*pow(NdotH,2.0) + Nv * (1.0-pow(NdotH,2.0));
    float NumeradorParcial= sqrt( (Nu+1.0)*(Nv+1.0) ) * NdotH;
    float Numerador = pow(NumeradorParcial,AshShiExp) * Schlick;

    float SpecularAshiShi = Numerador/Divisor;

    // Coeficiente difuso de Ashikhmin-Shirley
    vec3 PrimerTermino = (28.0*kd/28.0*PHI) * (1.0 - SpecularAshiShi);
    float SegundoTermino = 1.0-pow((1.0- NdotL/2.0),5.0);
    float TercerTermino = 1.0-pow((1.0- NdotV/2.0),5.0);
    vec3 DifusoAshShi = PrimerTermino*SegundoTermino*TercerTermino;
    toReturn =  ka+ia*(DifusoAshShi + SpecularAshiShi) * NdotL;
  }
  return toReturn;
}

vec3 calcularAportePuntual(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N, vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);
  vec3 H = normalize(V+L);
  vec3 S = normalize(vec3(dirL));
  vec3 toReturn = ka;
  float difusoBlPh = max(dot(L,N),0.0) ;
  float specBlPh = pow(max(dot(N,H),0.0),coefEspec);

  if(dot(L,N)< 0.0){
    specBlPh = 0.0;
  }

  // Producto escalar
  float NdotH = max(dot(N,H),0.000001);
  float NdotL = max(dot(N,L),0.000001);
  float VdotH = max(dot(V,H),0.000001);
  float NdotV = max (dot(N,V),0.00001);
  float HdotL = max (dot(H,L),0.00001);

  //Termino de Fresnel segun Schlick

  float Schlick = pow(1.0 - NdotH, 5.0);
  Schlick *= (1.0 - F0);
  Schlick += F0;

  //Termino de Fresnel segun Schlick
  float terminoN = (1.0+sqrt(F0))/(1.0-sqrt(F0));
  float terminoC = max(dot(V,H),0.0);
  float terminoG = sqrt( pow(terminoN,2.0) + pow(terminoC,2.0) -1.0);
  float CK1T = pow( (terminoG-terminoC)/(terminoG+terminoC) ,2.0) * 0.5;
  float CK2T = (1.0 + pow( ( (terminoG + terminoC)*terminoC -1.0 )/((terminoG - terminoC)*terminoC + 1.0 ),2.0));
  float CK = CK1T*CK2T;


  // Coeficiente difuso de Ashikhmin-Shirley
  vec3 PrimerTermino = (28.0*kd/28.0*PHI) * (1.0 - ks);
  float SegundoTermino = 1.0-pow((1.0- NdotL/2.0),5.0);
  float TercerTermino = 1.0-pow((1.0- NdotV/2.0),5.0);
  vec3 DifusoAshShi = PrimerTermino*SegundoTermino*TercerTermino;

  // Coeficiente especular de Ashikhmin-Shirley

  float Divisor = 8.0*PHI*HdotL * max(NdotV,NdotL);

  float AshShiExp = Nu*pow(NdotH,2.0) + Nv * (1.0-pow(NdotH,2.0));
  float NumeradorParcial= sqrt( (Nu+1.0)*(Nv+1.0) ) * NdotH;
  float Numerador = pow(NumeradorParcial,AshShiExp) * Schlick;

  float SpecularAshiShi = Numerador/Divisor;


  toReturn =  ka+ia*(DifusoAshShi + SpecularAshiShi) * NdotL;
  return toReturn;
}


vec3 calcularAporteDireccional(vec4 posL, vec4 dirL, vec3 ia, float limit, vec3 N, vec3 V){
  vec3 light_direction = vec3(posL + vec4(vVE,1.0)); //direccion de la luz al vertice
  vec3 L = normalize(light_direction);

  vec3 S = normalize(vec3(dirL));
  vec3 H = normalize(V+S);
  vec3 toReturn = ka;
  float difusoBlPh = max(dot(S,N),0.0) ;
  float specBlPh = pow(max(dot(N,H),0.0),coefEspec);

  if(dot(S,N)< 0.0){
    specBlPh = 0.0;
  }

  // Producto escalar
  float NdotH = max(dot(N,H),0.000001);
  float NdotL = max(dot(N,S),0.000001);
  float VdotH = max(dot(V,H),0.000001);
  float NdotV = max (dot(N,V),0.00001);
  float HdotL = max (dot(H,S),0.00001);

  //Termino de Fresnel segun Schlick

  float Schlick = pow(1.0 - NdotH, 5.0);
  Schlick *= (1.0 - F0);
  Schlick += F0;

  //Termino de Fresnel segun Schlick
  float terminoN = (1.0+sqrt(F0))/(1.0-sqrt(F0));
  float terminoC = max(dot(V,H),0.0);
  float terminoG = sqrt( pow(terminoN,2.0) + pow(terminoC,2.0) -1.0);
  float CK1T = pow( (terminoG-terminoC)/(terminoG+terminoC) ,2.0) * 0.5;
  float CK2T = (1.0 + pow( ( (terminoG + terminoC)*terminoC -1.0 )/((terminoG - terminoC)*terminoC + 1.0 ),2.0));
  float CK = CK1T*CK2T;


  // Coeficiente difuso de Ashikhmin-Shirley
  vec3 PrimerTermino = (28.0*kd/28.0*PHI) * (1.0 - ks);
  float SegundoTermino = 1.0-pow((1.0- NdotL/2.0),5.0);
  float TercerTermino = 1.0-pow((1.0- NdotV/2.0),5.0);
  vec3 DifusoAshShi = PrimerTermino*SegundoTermino*TercerTermino;

  // Coeficiente especular de Ashikhmin-Shirley

  float Divisor = 8.0*PHI*HdotL * max(NdotV,NdotL);

  float AshShiExp = Nu*pow(NdotH,2.0) + Nv * (1.0-pow(NdotH,2.0));
  float NumeradorParcial= sqrt( (Nu+1.0)*(Nv+1.0) ) * NdotH;
  float Numerador = pow(NumeradorParcial,AshShiExp) * Schlick;

  float SpecularAshiShi = Numerador/Divisor;


  toReturn =  ka+ia*(DifusoAshShi + SpecularAshiShi) * NdotL;
  return toReturn;
}
void main(){
    // Normalizo los vectores
    vec3 N = normalize(vNE);
    //vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    //vec3 H = normalize(L+V);

    colorFrag = vec4(calcularAporteSpot(posL, dirL, ia, limit, N, V) + calcularAportePuntual(posL2, dirL2, ia2, limit2, N, V) + calcularAporteDireccional(posL3, dirL3, ia3, limit3, N, V) ,1.0);
	//colorFrag = kd*(Fres/3.141516)+ks*(Beckmann*GCT)/(dot(N,V)*dot(N,L));
	//colorFrag = ka +kd*difuso +ks*(Fres/3.141516)* (Beckmann*GCT)/max(dot(N,V),0.0)*max(dot(N,L),0.0);
}`
