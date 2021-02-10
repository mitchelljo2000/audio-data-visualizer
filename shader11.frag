// Lisa Jamhoury Adaptation of Book of Shaders examples by 
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015
// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(9.0, 720.0, 1.0, 1.0);
vec4 convertedData2 = convertedData+vec4(1.0, 80.0, 0.0, 0.0);

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 2
float fbm (in vec2 st) {
    // Initial values
    float value = .0;
    float amplitude = .5;
    float frequency = 1.*(abs(sin(convertedData2.x*u_time/10.)))*-1.0; // HERE xy
    float zoom = 5.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= zoom;
        amplitude *= frequency;
    }
    return value;
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.0);
    color += fbm(st);
    
    float d = length( abs(color)-.3 );
    d = fbm(vec2(d));
    d *=d;
        // d *=d;
      // d = length( min(abs(color)-.3,0.) );

    // color += fbm(st*3.0);
	
    gl_FragColor = vec4(color,1.0);
     gl_FragColor = vec4(vec3(1.0-d),1.0);
      gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);
    
	gl_FragColor = vec4(vec3(fract(d*10.0)),1.0);
    
    	float c = fract(d*80.0);
        c = sin(d*convertedData2.y); // HERE y 80.0
        gl_FragColor = vec4(1.0-.78*c,1.0-.60*c,1.0-.33*c,backgroundAlpha);    
		
    	// vec3 newc = hsb2rgb(vec3(c,1.0,1.0));
    	// gl_FragColor = vec4(newc.r,1.0,newc.g,1.0);

    
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);
    
    // gl_FragColor = vec4(vec3( step(.3,d) ),1.0);
    
      // gl_FragColor = vec4(vec3( step(.3,d) * step(d,.4)),1.0);
  // gl_FragColor = vec4(vec3( smoothstep(.3,.4,d)* smoothstep(.6,.5,d)) ,1.0);

}
