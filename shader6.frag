
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(18.0, 3.0, 2.0, 1.0);
vec4 convertedData2 = convertedData+vec4(2.0, 0.5, 0.5, 0.0);

float sum_abs(vec2 p)
{
    return abs(p.x)+abs(p.y);
}

vec2 voronoi_noise_randomVector(vec2 UV, vec2 offset)
{
	mat2 m = 	mat2(15.27, 47.63, 99.41, 89.98);
	UV = fract(sin(UV* m) * 46839.32);
	return vec2(sin(UV.y * +offset.x) * convertedData2.y + 0.5, cos(UV.x * offset.y) * convertedData2.z + 0.5); // HERE y first 0.5; HERE z third 0.5
}

void ManhattanVoronoi(vec2 UV, vec2 AngleOffset, vec2 CellDensity, out float Out, out float Cells, out float Lines,out float Points)
{
	vec2 g = floor(UV * CellDensity);
	vec2 f = fract(UV * CellDensity);
	
	float res = 8.0;
	float md=8.0;
    vec2 mr;
	for (int y = -1; y <= 1; y++)
 	{
	    for (int x = -1; x <= 1; x++)
		{
		    vec2 lattice = vec2(x, y);
            vec2 offset = voronoi_noise_randomVector(lattice + g, AngleOffset);
            vec2 r = lattice +offset -f;
            float d =sum_abs(r);
			if (d < res)
			{
			    res = d;
                mr=r;
			}
		}
	}
    res = 8.0;
	for (int y = -1; y <= 1; y++)
 	{
	    for (int x = -1; x <= 1; x++)
		{
		    vec2 lattice = vec2(x, y);
            vec2 offset = voronoi_noise_randomVector(lattice + g, AngleOffset);
            vec2 r = lattice +offset -f;
           	float d =sum_abs(r);
			if (d < res)
			{
			    res = d;
			    Out = res;
			    Cells = offset.x;
			}
			if( dot(mr-r,mr-r)>0.00001)
			{
                md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
			}
		}
	}

	Lines = mix(1.0, 0.0, smoothstep( 0.03, 0.06, md ));
	Points =1.0-smoothstep( 0.0, 0.3, res );
}
void main()
{
 	vec2 p = gl_FragCoord.xy/iResolution.xy;
   	p=p*convertedData2.x-1.0; // HERE x 2.0
	p.x *= iResolution.x / iResolution.y;
    vec3 col;
    float a,b,c,d;
    ManhattanVoronoi(p,vec2(3.0+cos(iTime)),vec2(5.0,5.0),a,b,c,d);
    //col=vec3(a);
    col=vec3(b);
    //col=vec3(c);
    //col=vec3(d);
	gl_FragColor = vec4(col,backgroundAlpha);

}