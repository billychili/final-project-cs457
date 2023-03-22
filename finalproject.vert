#version 330 compatibility

uniform float uScale;
uniform float uLightX, uLightY, uLightZ;

uniform float uNoiseAmp;
uniform float uNoiseFreq;

out vec2 vST;
out vec3 vNormal;

uniform sampler2D uTexUnit;
uniform sampler2D Noise2;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

const float PI = 3.14159265;
const float G = 1.;

void
main( )
{

    vec2 st = gl_MultiTexCoord0.st; 
    vST = st; 
    vec3 norm = normalize( gl_Normal ); 
    vNormal= normalize( gl_NormalMatrix * gl_Normal ); 
    float disp = texture( uTexUnit, st ).r;
    disp *= uScale;
    
    vec3 vert = gl_Vertex.xyz; 
    vert += norm * disp; 
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.);

}

