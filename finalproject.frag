#version 330 compatibility 

uniform float uLightX, uLightY, uLightZ;
uniform float uKd, uKs;
uniform sampler2D uTexUnit;
uniform sampler2D Noise2;

uniform float uTol, uSunY , uNoiseAmp, uNoiseFreq;
uniform vec4 uColor;
uniform sampler3D Noise3;
uniform float Timer;
uniform int uNumFacets;
uniform float uPower;

in vec2 vST;
in vec3 vMC;
in vec3 vECpos;
in vec3 vN;  
in vec3 vL;
in vec3 vE;
in vec3 vNormal;

in vec3 rainbow_strip;
in vec4 disco_color; 

const vec4 WHITE = vec4(1., 1., .8, 1. );

const float PI = 3.14159265;
const vec3 BALLPOS = vec3( 0., 2., 0. );
const vec3 LIGHTPOS = vec3( 2., 0., 0. );
const vec3 LIGHTCOLOR = vec3( 1., 1., 1. );

vec3
RotateNormal(float angx,float angy,vec3 n)
{
	float cx=cos(angx);
	float sx=sin(angx);
	float cy=cos(angy);
	float sy=sin(angy);
	

	float yp=n.y*cx-n.z*sx;// y'
	n.z=n.y*sx+n.z*cx;// z'
	n.y=yp;

	float xp=n.x*cy+n.z*sy;// x'
	n.z=-n.x*sy+n.z*cy;// z'
	n.x=xp;
	
	return normalize(n);
}


void
main( )
{

	vec3 Normal=normalize(vN);
	vec3 light = normalize( vec3( uLightX, uLightY, uLightZ) ); 
	vec3 Eye=normalize(vE);
	
	vec4 nvx=texture(Noise3,uNoiseFreq*vMC);
	float angx=nvx.r+nvx.g+nvx.b+nvx.a-2.;
	angx*=uNoiseAmp;
	
	vec4 nvy=texture(Noise3,uNoiseFreq*vec3(vMC.xy,vMC.z+.5));
	float angy=nvy.r+nvy.g+nvy.b+nvy.a-2.;
	angy*=uNoiseAmp;

    vec3 n=RotateNormal(angx,angy,Normal);
    vec3 ref=normalize(reflect(-light,n));
    vec3 noise_Color = ref.rgb;

    vec4 specular = uKs * WHITE;

    int numTheta = uNumFacets;
    int numPhi = uNumFacets; 
    float dtheta = 2. * PI / float(numTheta);
    float dphi = PI / float(numPhi);

    vec3 BP = normalize( vECpos - BALLPOS ); 

    float angle = radians(Timer*360.);
    float c = cos( angle );
    float s = sin( angle );
    vec3 bp;
    bp.x = c*BP.x + s*BP.z;
    bp.y = BP.y;
    bp.z = -s*BP.x + c*BP.z; 

    vec3 BL = normalize( LIGHTPOS - BALLPOS );
    vec3 H = normalize( BL + bp );

    float xz = length( H.xz );
    float phi = atan( H.y, xz );
    float theta = atan( H.z, H.x ); 
    int itheta = int( floor( ( theta + dtheta/2. ) / dtheta ) );
    int iphi = int( floor( ( phi + dphi/2. ) / dphi ) );
    float theta0 = dtheta * float(itheta);
    float phi0 = dphi * float(iphi);
    vec3 N0;
    N0.y = sin(phi0);
    xz = cos(phi0);
    N0.x = xz*cos(theta0);
    N0.z = xz*sin(theta0);
    float d = max( dot( N0, H ), 0. ); 
    const float DMIN = 0.990; 
    if( d < DMIN ){
        d = 0.;
    }

    d = pow( d, uPower );
	if( dot(Normal,light) > 0. ) // only do specular if the light can see the point
	{
		vec3 ref = normalize( 2. * Normal * dot(Normal,light) - light );
	}

	float intensity = uKd * abs( dot( vNormal, light ) ); 
	intensity += (1.-uKd); 
	vec3 newcolor = texture( uTexUnit, vST).rgb; 
	gl_FragColor = vec4( (newcolor*intensity) + rainbow_strip + uColor.rgb + noise_Color + specular.rgb + d*LIGHTCOLOR , 1. );
}
