// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource =`#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;

uniform vec4 ka;
uniform vec4 kd;
uniform vec4 ks;
uniform float p;
uniform float sigma;
uniform mat4 MV;
uniform mat4 viewMatrix;

uniform vec3 ia;

uniform float limit;
uniform vec4 posL;
//uniform light [2];
uniform vec3 dirL;
void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    //OREN-NAYAR
    vec3 v = normalize(-L-N*dot(N,L) );
    vec3 u = normalize(-V-N * dot(N,V));
    float phiDiff = max(dot(u,v),0.0);
    float A = 1.0 - 0.5 * sigma/(pow(sigma,2.0)+0.33);
    float B = 0.45 * (sigma/(pow(sigma,2.0)+0.09));
    float cosR = max(dot(N,V),0.0);
    float cosI = max(dot(N,L),0.0);
    float anguloR = acos(cosR);
    float anguloI = acos(cosI);
    float a = max(anguloR,anguloI);
    float b = min(anguloR,anguloI);
    float f0N = (p/PI )* cosI*(A+B*max(0.0,phiDiff)*sin(a)*tan(b));

    float titaH = max(dot(N,H),0.0);
    float Beckmann;

    //Termino de Fresnel
    float F0 = 0.713;
    float Fres = pow(1.0 - titaH, 5.0);
    Fres *= (1.0 - F0);
    Fres += F0;

    //Termino de Beackmann
    float coeficienteA = 0.214187;
    float divisor = pow(coeficienteA,2.0)* pow(titaH,4.0);
    float exponente = -(pow(tan(acos(titaH))/coeficienteA,2.0));
    exponente = exp(exponente);
    Beckmann = exponente/divisor;

    //Variables de la atenuacion geometrica
    float GCT;
    float Ge;
    float Gs;
    float titaV = max(dot(V,H),0.0);
    Ge = (2.0*titaH*cosR)/(cosR);
    Gs = (2.0*titaH*cosI)/(cosR);

    GCT=min(1.0,Ge);
    GCT=min(GCT,Gs);

    float difuso = 0.0 ;
    float specBlinnPhong =0.0;


  //float cutOffAngle= 180.0;
  //float angularAttenuation = 0.5;
  vec3 direccion = normalize(vec3(viewMatrix*vec4(dirL,0.0)));
  float LdotD = max(dot(-L,direccion),0.0);
  float dotFromDirection = acos(LdotD);
  //float mapToCutOff = radians(90.0) / limit; // mapping from [0, cutOff] to [0, 90], so that at the border cos(90) = 0
	//float angularAttenuationFactor = pow(cos(dotFromDirection * mapToCutOff), 0.5);
  vec4 ambiente = vec4(0.0,0.0,0.0,1.0);
  if(dotFromDirection < limit){
    // if(dotFromDirection > 0.05){
    //   colorFrag = ka;
    // }
    // else{
      float componente = max(dot(N,V)*dot(N,L),0.0);
      if(componente>0.0){
      colorFrag = vec4(ia,1.0)*(ka+ kd * f0N + +ks*(Fres/3.141516)* (Beckmann*GCT)/componente);
    }
      else colorFrag = vec4(ia,1.0)*(ka+kd*f0N);
    //}

  }
  else
    colorFrag = vec4(0.0,0.0,0.0,1.0);
  //colorFrag = vec4(ia,1.0)*(ambiente + kd * difuso + ks * specBlinnPhong);
}
`
