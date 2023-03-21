#version 330 compatibility 

uniform float uLightX, uLightY, uLightZ;
uniform float uKd;
uniform sampler2D uColorUnit;

in vec2 vST;
in vec3 vNormal;

void
main( )
{
	vec3 light = normalize( vec3( uLightX, uLightY, uLightZ ) ); 
	float intensity = uKd * abs( dot( vNormal, light ) ); 
	intensity += (1.-uKd); 
	vec3 newcolor = texture( uColorUnit, vST).rgb; 
	gl_FragColor = vec4( newcolor*intensity, 1. );
}
