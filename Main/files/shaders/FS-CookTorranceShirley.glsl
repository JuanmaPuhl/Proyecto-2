var FS_CookTorranceShirley =` #version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;

in vec3 vNE;
in vec3 vLE;
in vec3 vVE;

out vec4 colorFrag;

uniform vec3 CoefiienteAmbiental;
uniform vec3 CoeficienteDifuso;
uniform vec3 CoeficienteEspecular;

uniform float coefEspec;
uniform vec3 ia;

uniform float rugosidad; // Se usa en las funciones de microfacetas
uniform float F0;        //Se usa en las funciones de fresnel

uniform float Nu;
uniform float Nv;

void main()
{
    float PHI =3.141516;

    // Normalizo los vectores
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);

    //Calculo termino difuso + espec de Blinn-Phong
    float difusoBlPh = max(dot(L,N),0.0) ;
    float specBlPh = pow(max(dot(N,H),0.0),coefEspec);

    if(dot(L,N)< 0.0)
    	{
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




    // NDF - Termino de Beackmann
    float Beckmann;
 	float coeficienteA = max(rugosidad*rugosidad, 0.00001);
    float divisorBec = pow(coeficienteA,2.0)* pow(NdotH,4.0);
    float exponente = -(pow(tan(acos(NdotH))/coeficienteA,2.0));
    exponente = exp(exponente);
    Beckmann = exponente/divisorBec;

    //NDF - Termino de Trrowbridge-Reitz

    float coeficienteATR = rugosidad*rugosidad;
    float divisorTR = 3.1415 * pow( (pow(NdotH,2.0)*(coeficienteATR-1.0)) +1.0 ,2.0 );
    float TrRe = coeficienteATR / divisorTR;



    // NDF - GGX Walts

    float factorM = rugosidad;
    float factorX = step(1.0, NdotH);
    float divisorGGX = 3.141516 * pow(NdotL,4.0) * (pow(factorM,2.0) + pow(tan(acos(NdotH)),2.0),2.0);
    float GGX = factorX*pow(factorM,2.0);
    GGX = GGX / divisorGGX;

    //Geometric Shadowing - Implicito
    float GSImplicito = NdotL * NdotV;

    // Geometric Shadowing - Neumann
    float NeumanNumerador = NdotL * NdotV;
    float neumanDenominador = max(NdotL, NdotV);
    float GSNeumann = NeumanNumerador/neumanDenominador;

    //Geometric Shadowing - CookTorrance
 	float GCT;
    float Ge = (2.0 * NdotH * NdotV )/( VdotH );
    float Gs = (2.0 * NdotH * NdotL )/( VdotH );
	GCT=min(1.0,Ge);
    GCT=min(GCT,Gs);

    //Geometric Shadowing - Kelemen
    float GSKelemen = (NdotL * NdotV) / pow(VdotH,2.0);



    // Coeficiente difuso de Ashikhmin-Shirley
    vec3 PrimerTermino = (28.0*CoeficienteDifuso/28.0*PHI) * (1.0 - CoeficienteEspecular);
    float SegundoTermino = 1.0-pow((1.0- NdotL/2.0),5.0);
    float TercerTermino = 1.0-pow((1.0- NdotV/2.0),5.0);
    vec3 DifusoAshShi = PrimerTermino*SegundoTermino*TercerTermino;

    // Coeficiente especular de Ashikhmin-Shirley

    float Divisor = 8.0*PHI*HdotL * max(NdotV,NdotL);


    float AshShiExp = Nu*pow(NdotH,2.0) + Nv * (1.0-pow(NdotH,2.0));
    float NumeradorParcial= sqrt( (Nu+1.0)*(Nv+1.0) ) * NdotH;
    float Numerador = pow(NumeradorParcial,AshShiExp) * Schlick;

    float SpecularAshiShi = Numerador/Divisor;




   float Fresnel = Schlick;
   float NDF = Beckmann;
   float GeometricShadowing = GCT;

   float CookTorrenceBRDF = (NDF * GeometricShadowing * Fresnel) / (4.0 * NdotL * NdotV);



    //float CookTorrenceBRDF = (TrRe)/(4.0*(NdotV * NdotL));

    colorFrag= vec4(ia*(DifusoAshShi + SpecularAshiShi) * NdotL,1.0);
	//colorFrag = kd*(Fres/3.141516)+ks*(Beckmann*GCT)/(dot(N,V)*dot(N,L));
	//colorFrag = ka +kd*difuso +ks*(Fres/3.141516)* (Beckmann*GCT)/max(dot(N,V),0.0)*max(dot(N,L),0.0);
}`
