#version 330 compatibility

uniform float uScale;
uniform float uLightX, uLightY, uLightZ;
uniform float uTol, uSunY;
uniform float Timer;
uniform float uTimeScale;

uniform float uNoiseAmp;
uniform float uNoiseFreq;


out vec2	vST;
out vec3 	vMC;
out vec3  	vL;            // vector from point to light
out vec3  	vE; 
out vec3  	vN;  
out vec3 vECpos;
out vec3 vNormal;

uniform sampler2D uTexUnit;
uniform sampler2D Noise2;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

out vec3  	rainbow_strip;
out vec4 	disco_color; 

out float vLightIntensity;

const float PI = 3.14159265;
const float G = 1.;
const vec3 LIGHTPOS = vec3( 2., 0., 0. );

float
Pulse( float min, float max, float tol, float t )
{
	float a = min - tol;
	float b = min + tol;
	float c = max - tol;
	float d = max + tol;
	return smoothstep(a,b,t) - smoothstep(c,d,t);
}

void
main( )
{
    vECpos = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vec3 tnorm = normalize( vec3( gl_NormalMatrix * gl_Normal ) );
	vLightIntensity = dot( normalize(LIGHTPOS - vECpos), tnorm );
	vLightIntensity = abs( vLightIntensity );
	disco_color = gl_Color;

	float t = .5 + .5*sin(2. *(PI)*Timer );

	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;	

	vec3 SunDirection = vec3( 0., (uSunY * t * uTimeScale), 10. );
	vL = SunDirection - ECposition.xyz;	

    vec3 PtToSun = normalize( SunDirection  );
    vec3 PtToEye = normalize( vec3(0.,0.,0.) - ECposition ) ;
    float costheta = dot( PtToEye, PtToSun  ) ;


    float R = Pulse( .7400, .7490, uTol, costheta );
    float G = Pulse( .7490, .7605, uTol, costheta);
    float B = Pulse( .7605, .7700, uTol, costheta);
	rainbow_strip = vec3(R, G, B);

	vec3 Tx = vec3(1., 0., .5 );
	vec3 Ty = vec3(0., 1., .5 );
	vec3 normal = normalize( cross( Tx, Ty) );
	vN = normalize( gl_NormalMatrix * normal );	// normal vector 

	vST = gl_MultiTexCoord0.st;
	vMC = gl_Vertex.xyz;

    vec2 st = gl_MultiTexCoord0.st; 
    vST = st; 
    vec3 norm = normalize( gl_Normal ); 
    vNormal= normalize( gl_NormalMatrix * gl_Normal ); 
    float disp = texture( uTexUnit, st ).r;
    disp *= uScale;
    
    vec3 vert = gl_Vertex.xyz; 
    vert += norm * disp; 
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.) ;

}

