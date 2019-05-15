// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderSource =`#version 300 es
precision highp float;
uniform mat4 viewMatrix;
in vec3 vNE;
in vec3 vLE;
in vec3 vVE;
out vec4 colorFrag;
uniform vec3 ka;
uniform float coefEspec;
uniform vec3 kd;
uniform vec3 ks;
uniform vec3 dirL;
uniform float limit;
void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);

    vec3 lightDirection_EyeSpace = vec3(viewMatrix* vec4(dirL,0.0));
    vec3 D = normalize(lightDirection_EyeSpace);


    float LdotN = max(dot(L,N),0.0);
    float HdotV = max(dot(H,N),0.0);
    float LdotD = max(dot(-L,D),0.0);
    float angle = acos(LdotD);
    bool insideSpot = angle<limit;

    vec3 ambient = ka;
    vec3 diffuse = vec3(0.0,0.0,0.0);
    vec3 specular = vec3(0.0,0.0,0.0);
    if(insideSpot){
        diffuse = kd * LdotN;
        specular = ks * pow(HdotV,coefEspec);
    }
    colorFrag =vec4( ambient+diffuse + specular,1.0);
    //Calculo termino difuso + espec de Blinn-Phong
    //float difuso = max(dot(L,N),0.0) ;
    //float specBlinnPhong = pow(max(dot(N,H),0.0),coefEspec);
    //if(dot(L,N)< 0.0){
    //    specBlinnPhong = 0.0;
    //}
  	//colorFrag = ka + kd*difuso + ks*specBlinnPhong;

}
`
