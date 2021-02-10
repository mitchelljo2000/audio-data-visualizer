
// Lisa Jamhoury Adaptation of Book of Shaders examples by 
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(1.0, 1.0, 1.0, 1.0);
vec4 convertedData2 = convertedData+vec4(0.5, 0.5, 0.5, 0.0);

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    
    // move even rows horizontally
    _st.x -= step(1., mod(_st.y,2.0)) * convertedData2.x * u_time; // HERE x 0.5

  // move odd rows horizontally -- in opposite direction 
  _st.x += smoothstep(1., mod(_st.y,2.0), 0.0) * convertedData2.y * u_time; // HERE y 0.5
    
  // move even columns vertically
    _st.y -= step(1., mod(_st.x,2.0)) * convertedData2.z * u_time; // HERE z 0.5
  
  // move the gradient horizontally ( to move odd colums vertically change first _st.x to _st.y )
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Apply tiling
    st = brickTile(st,5.0);

    color = vec3(box(st,vec2(0.9)));

    // Add gradient with space coordinates
    color = vec3(st,0.0);

    gl_FragColor = vec4(st.x, st.y,1.0,backgroundAlpha);
}
