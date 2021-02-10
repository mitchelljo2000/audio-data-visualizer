// Different mouse controls. Possible values: 0, 1, 2

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(1.0, 1.0, 1.0, 1.0);
vec4 convertedData2 = convertedData+vec4(0.0, 0.5, 0.5, 0.0);


vec2 center = vec2(convertedData2.y,convertedData2.z); // HERE y 0.5; HERE z 0.5
float speed = convertedData.x; // HERE x 0.035

void main()
{
    float invAr = iResolution.y / iResolution.x;

    vec2 uv = gl_FragCoord.xy / iResolution.xy;
		
	vec3 col = vec4(uv,0.5+0.5*sin(iTime),1.0).xyz;
   
     vec3 texcol;
			
	float x = (center.x-uv.x);
	float y = (center.y-uv.y) *invAr;
		
	//float r = -sqrt(x*x + y*y); //uncoment this line to symmetric ripples
	float r = -(x*x + y*y);
	float z = 1.0 + 0.5*sin((r+iTime*speed)/0.013);
	
	texcol.x = z;
	texcol.y = z;
	texcol.z = z;
	
	gl_FragColor = vec4(col*texcol, backgroundAlpha);
}


