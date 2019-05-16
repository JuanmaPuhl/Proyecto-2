var FS_OrenNayar = `#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec4 ka;
uniform float coefEspec;
uniform vec4 kd;
uniform vec4 ks;
uniform float p;
uniform float sigma;
uniform vec4 ia;

void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);

    float f0N = 0.0;

	//OREN-NAYAR
    //vec3 v = normalize(-L-N*dot(N,L) );
    //vec3 u = normalize(-V-N * dot(N,V));
    //float phiDiff = max(dot(u,v),0.0);
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
  	colorFrag = ka + kd * ia* f0N ;

}`
