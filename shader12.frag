// Lisa Jamhoury Adaptation of Book of Shaders examples by 
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015
// Author: @patriciogv - 2015
// Tittle: Turbulence

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(2.0, 9.5, 54.0, 1.0);
vec4 convertedData2 = convertedData+vec4(2.0, 0.5, 6.0, 0.0);

#define PI 3.1415926535897932384626433832795

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

#define OCTAVES 4 
// 2
// 3
float turbulence (in vec2 st) {
    // Initial values
    float value = .1; // 0.0
    float amplitude = 5.; //0.5
    float frequency = 0.; //0.0

 value = .5; // 0.0
 amplitude = 5.; //0.5
 frequency = -2.7; //0.0

     for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * abs(snoise(st));
        st *= convertedData2.x; // HERE x 2.
        // amplitude *= .5;
        // amplitude *= frequency * abs(sin(u_time/10.0));
        // amplitude *= frequency * abs(sin(u_time/1.0));
        // amplitude *= frequency * tan(u_time);
         amplitude *= frequency;
    }
    //
    // Loop of octaves
    // for (int i = 0; i < OCTAVES; i++) {
    //     value *= amplitude * abs(snoise(st));
    //     st *= 2.;
    //     amplitude *= .5;
    //     // amplitude *= frequency * abs(sin(u_time/10.0));
    //     // amplitude *= frequency*0.5 + abs(sin(u_time/10.0));
    //     amplitude *= frequency*0.5;
    // }
    return value;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*convertedData2.z+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 ); // HERE z first 6.0
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    
    // st*= 3.0;

    // st -= vec2(0.5);
    // st = rotate2d(sin(u_time/100.))*st;
    // st += vec2(0.5);
    
    // color += turbulence(st*.9);
	// color = vec3(step(0.5, turbulence(st*5.0)));
	// color = vec3(step(turbulence(st*5.0), fract(u_time/10.0)));
	// color = vec3(smoothstep(0.0,turbulence(st), 0.5*fract(u_time/10.0)));
	// color = vec3(smoothstep(0.0,turbulence(st), 1.*abs(fract(u_time/8.0))-0.2));
	// color = vec3(smoothstep(0.0,turbulence(st*.5)*abs(sin(u_time)), 1.0));
    // color = vec3(smoothstep(0.0,turbulence(st), 1.));
    
    color = vec3(smoothstep(0.0,turbulence(st*.5)*abs(sin(u_time*0.4)), 1.0));
	
    
    float turb = turbulence(st*.5)*abs(sin(u_time*convertedData2.y)); // HERE y 0.5
    
    // if (turb < 1.0) turb -=100.0;
    if (turb > 10.0) turb -=10.0;

    
    color = vec3(smoothstep(0.0,turb, 1.0));
    color.r = clamp( color.r, 0.2,.5);	
  
    // color = hsb2rgb(vec3(color.r,0.8,0.9));
    color = hsb2rgb(vec3(color.r,1.0,1.0));  

    gl_FragColor = vec4(1.0-color,backgroundAlpha);
        
}
