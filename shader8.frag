// Lisa Jamhoury Adaptation of Book of Shaders examples by 
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(20.0, 20.0, 30.0, 1.0);
vec4 convertedData2 = convertedData+vec4(3.0, 0.5, 2.0, 0.0);

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {

    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-convertedData2.z*f); // HERE z 2.0
    u = smoothstep(0.,1.,f*u*u); // LJ added extra *u, makes more boxy, less rounded 
    
    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc

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

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*convertedData2.x); // HERE x 3.

    // Use the noise function
    float n = noise(pos);

    // Add distance field  
    float d = length (abs(n)-.3);
    d = length( max(abs(n)-.3,0.) );
    
    // For drawing distance field 
    float trippy =fract(d*40.0*(abs(cos(sin(u_time))*convertedData2.y))); // HERE y 0.5
  
    // clamp to restrict hue (no red)
    trippy = clamp(trippy,0.2,0.8);
  
    // optional use other clamp for saturation 
	  // float trippyS  = clamp(trippy,0.4,0.5);
    
    // use hsb color for trippy effect
    vec3 clr = hsb2rgb(vec3(trippy,trippy,1.0));
    
    
    gl_FragColor = vec4(vec3(clr),backgroundAlpha);

}
