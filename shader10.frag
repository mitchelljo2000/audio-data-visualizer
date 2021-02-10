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

vec4 convertedData = iData*vec4(5.0, 54.0, 1.0, 1.0);
vec4 convertedData2 = convertedData+vec4(2.0, 6.0, 0.0, 0.0);


vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + convertedData2.x*fract(sin(st)*43758.5453123); // HERE x 2.0
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}



vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*convertedData2.y+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 ); // HERE y first 6.0
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
    // move the coordinate space around for different views/effects   
    // st = st *2.-1.5;
    // st = st *2.-1.;
    st *= vec2(3.0,3.0);
    
    vec3 color = vec3(0.0);

    // animates the coordinate space 
    float t = 1.0;
    t = abs(1.0-sin(u_time*.1))*5.+0.5; // add .5 to avoid going back to straight lines 
    st += noise(st*2.)*t; 
    
    
    // draw distance field 
    float d = length( noise(st)-.50 );
    d = length( max(abs(st)-.3,0.3) );
  
    // use smoothstep to clean up the lines 
    // remove to get more fuzzy, gradient
    d = smoothstep(0.1,0.4,noise(vec2(d)));
    
    // draw green 
    vec3 c = hsb2rgb(vec3(d,1.0,1.0));
    gl_FragColor = vec4(0.0,c.g,0.0,backgroundAlpha);
  
    // reverse colors 
    // gl_FragColor = vec4(0.0,1.0-c.g,0.0,1.0);
    
    
}
