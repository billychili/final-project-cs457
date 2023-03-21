#version 330 compatibility

uniform float uScale;
uniform sampler2D uDispUnit;

out vec2 vST;
out vec3 vNormal;

void
main( )
{

    vec2 st = gl_MultiTexCoord0.st; 
    vST = st; 
    vec3 norm = normalize( gl_Normal ); 
    vNormal= normalize( gl_NormalMatrix * gl_Normal ); 
    
    vec3 vert = gl_Vertex.xyz; 
    vert += norm * uScale; 
    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.);

}

