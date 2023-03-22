#version 330 compatibility 

uniform float uLightX, uLightY, uLightZ;
uniform float uKd, uKs;
uniform sampler2D uTexUnit;
uniform sampler2D Noise2;

uniform float uNoiseAmp;
uniform float uNoiseFreq;

in vec2 vST;
in vec3 vNormal;

const vec4 WHITE = vec4( 1., 1., .8, 1. );


void
main( )
{

	vec3 normal = normalize( vec3(vST, 1.) );
	vec3 light = normalize( vec3( uLightX, uLightY, uLightZ) ); 

	float s = 0.;
	if( dot(normal,light) > 0. ) // only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * normal * dot(normal,light) - light );
	}

	vec4 specular = uKs * s * WHITE * uNoiseFreq *uNoiseAmp;

	float intensity = uKd * abs( dot( vNormal, light ) ); 
	intensity += (1.-uKd); 
	vec3 newcolor = texture( uTexUnit, vST).rgb; 
	gl_FragColor = vec4( (newcolor*intensity) + specular.rgb , 1. );
}
