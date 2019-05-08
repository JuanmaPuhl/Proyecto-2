// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource =`#version 300 es

precision highp float;
#define PI 3.1415926535897932384626433832795
in vec3 vNE;
in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec4 ka;
uniform float coefEspec;
uniform vec4 kd;
uniform vec4 ks;
uniform float ax;
uniform float ay;

uniform vec3 ia;
uniform vec3 id;
uniform vec3 is;

void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    float atenuacion = 1.0/(1.0+(0.1*length(vLE)));
    //Calculo termino difuso + espec de Blinn-Phong
    float difuso = max(dot(L,N),0.0) ;
    float specBlinnPhong = pow(max(dot(N,H),0.0),coefEspec);
    if(dot(L,N)< 0.0){
        specBlinnPhong = 0.0;
    }
    //colorFrag =  vec4(ia,1.0) * ka + vec4(id,1.0) * atenuacion * (kd * difuso +  ks * specBlinnPhong);

    float anguloH = acos(dot(N,H)) ;
    float anguloI = acos(dot(L,N));


    float dividir = 4.0*PI*ax*ay;
    float titaH = max(dot(N,H),0.0);
    float titaI = max(dot(L,N),0.0);
    float coseno = pow(cos(anguloH),2.0);
    float seno = pow(sin(anguloI),2.0);
    float exponencial2 = exp(-1.0*pow(tan(anguloH*(coseno/pow(ax,2.0)+seno/pow(ay,2.0))),2.0));
    float termino = exponencial2/dividir;

    vec4 fresnelEspec = (ks/sqrt(cos(anguloH)*cos(anguloI))) * termino;
    vec4 fresnelDifuso =  kd/PI;
    vec4 fresnel = fresnelDifuso * difuso + fresnelEspec * specBlinnPhong;
    //vec4 fresnel = fresnelDifuso + fresnelEspec;
    colorFrag = titaI*(vec4(ia,1.0) * ka+ atenuacion*vec4(id,1.0) * fresnel) ;
}
`
