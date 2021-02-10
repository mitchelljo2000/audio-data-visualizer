
// Lisa Jamhoury Adaptation of Book of Shaders examples by 
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(18.0, 19.5, 1.0, 1.0);
vec4 convertedData2 = convertedData+vec4(2.0, 0.5, 0.1, 0.0);

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    
    _st.x += step(1., mod(_st.y,2.0)) * convertedData2.y * u_time; // HERE y 0.5
    _st.x += smoothstep(1., mod(_st.y,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;
    _st.x += smoothstep(1., mod(_st.x,2.0), 0.0) * 0.5 * u_time;

    
    
    
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st){

    //  Scale the coordinate system by 2x2
    _st *= convertedData2.x; // HERE x 2.0

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // _st = rotate2D(_st,PI*0.5);
    // _st = rotate2D(_st,PI*0.5);
    // Rotate each cell according to the index
    if(index == 1.0){
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st,PI);
    }

    return _st;
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st = tile(st,3.0);
    st = rotateTilePattern(st);


    st = tile(st,2.0);
    st = rotate2D(st,PI*u_time*convertedData2.z); // HERE z 0.1

    float color = step(st.x,st.y);    
    gl_FragColor = vec4(color, color,1.0,backgroundAlpha);
}
