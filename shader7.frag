
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform float backgroundAlpha;
uniform vec4 iData;

vec4 convertedData = iData*vec4(20.0, 10.0, 10.0, 1.0);
vec4 convertedData2 = convertedData+vec4(0.1, 0.5, 0.4, 0.0);

// Author: Rigel rui@gil.com
// licence: https://creativecommons.org/licenses/by/4.0/
// link: https://www.shadertoy.com/view/MlsfRX


/*
A study on symmetry. Took this pattern as a challenge and then tried to colorize it.
https://patterninislamicart.com/drawings-diagrams-analyses/5/geometric-patterns-borders/gpb033

The plane has four kind of symmetric operations
- translations
- rotations
- reflections
- glide reflections

This pattern only have the first three.
Everything is made of two simple rectangles, with translations, rotations, and
reflections.

*/

#define TAU 6.2831

// cartesian to polar coordinates
vec2 toPolar(vec2 uv) { return vec2(length(uv),atan(uv.y,uv.x)); }
// polar to cartesian coordinates
vec2 toCarte(vec2 z) { return z.x*vec2(cos(z.y),sin(z.y)); }
// 2d rotation matrix
mat2 uvRotate(float a) { return mat2(cos(a),sin(a),-sin(a),cos(a)); }
// A signed distance function for a rectangle
float sdfRect(vec2 uv, vec2 s) { vec2 auv = abs(uv); return max(auv.x-s.x,auv.y-s.y); }
// To fill an sdf with 0's or 1's
float fill(float d, float i) { return abs(smoothstep(.0,.02,d) - i); }

// palette from iq -> https://www.shadertoy.com/view/ll2GD3
vec3 pal(float d) { return .5 + convertedData2.y * cos(TAU*(d+vec3(.0,.10,.20))); } // HERE y second 0.5

// This makes a symmetric rotation around the origin.
// n is the number of slices, and everything is remmapped to the first one.
vec2 symrot(vec2 uv, float n) { 
    vec2 z = toPolar(uv); 
    return toCarte(vec2(z.x,mod(z.y,TAU / n) - TAU/(n*2.) ));
}

// This is the fundamental pattern where everything in the plane is remapped
// with symmetric operations.
vec3 pattern(vec2 uv) {
	
    // The coordinates for the two rectangles
	vec2 uv1 = uv*uvRotate(radians(30.));
	vec2 uv2 = uv*uvRotate(radians(-30.));
	
    // The signed distance functions
	float sdfr1 = sdfRect(uv1,vec2(.1,.7));
	float sdfr2 = sdfRect(uv2,vec2(.1,.7));
	
    // A fill to keep track of their areas and masks
	float r1 = fill(sdfr1,1.);
	float r2 = fill(sdfr2,1.);

	float r1mask = 1.-r1;
	float r2mask = 1.-r2;

	// Two waves, they are nothing more than the difference between two sine waves
	float wave1 = r1 * max(fill(0.05*sin((uv1.y+.5)*TAU+1.57)-uv1.x,0.),
						   fill(uv1.x-0.05*sin((uv1.y+.5)*TAU),0.));
	
	float wave2 = r1mask * r2 * max(fill(0.05*sin((uv2.y+.5)*TAU+1.57)-uv2.x,0.),
									fill(uv2.x-0.05*sin((uv2.y+.5)*TAU),0.));
	// The background
	vec3 bg = pal(.5-uv.y*convertedData2.x); // HERE x .1
    // Three circles to make the center flower
    float circle = length(uv-vec2(.0,.4));
    bg =  mix(bg, pal(.0), smoothstep(0.4,.0,circle) );
	bg =  mix(bg, pal(.5), smoothstep(0.11,.0,circle) );
	bg =  mix(bg, pal(.9), smoothstep(0.02,.0,circle) );
	
 	// Composing the rectangles and the waves to set up the foreground
	float d =  max(min(max(r1mask*r2,r1),wave1),wave2);
	
    // Colorizing the foreground
	vec3 fg = mix(pal(.9-uv.y*2.),pal(.15+uv.y*.1),d);
	// Adding a black contour to the rectangles 
    fg = mix(fg,vec3(.0),max(r1mask*fill(abs(sdfr2),1.),fill(abs(sdfr1),1.)));
	// Adding a faux 3d to the interlace of the rectangles
    fg = mix(fg,fg*convertedData2.z,r2*smoothstep(.0,.01,sdfr1)-smoothstep(.0,.1,sdfr1)); // HERE z .4
	
    // return foreground and background
    return mix(fg,bg,min(r1mask,r2mask));
}

// from Shane -> https://www.shadertoy.com/view/llSyDh
// I've removed the comments. Go to Shane shader to see them.
// This provides the translation symmetry, remaps everything in the plane to
// an hexagon centered at [0,0]
vec2 lattice6(vec2 uv) {
    const vec2 s = vec2(1, 1.7320508);
	
    vec4 hC = floor(vec4(uv, uv - vec2(.5, 1))/s.xyxy) + .5;
    vec4 h = vec4(uv - hC.xy*s, uv - (hC.zw + .5)*s);

    return dot(h.xy, h.xy)<dot(h.zw, h.zw) ? vec2(h.xy) : vec2(h.zw);
}

// The scene is just symmetry operations
vec3 scene(vec2 uv) {
	
    // translation symmetry
	uv = lattice6(uv)*6.;
	
    // a small alignement because the lattice is pointy hexagon side up
    // and my pattern is flat topped.
	uv *= uvRotate(radians(30.));

    // 6 fold rotations
	uv = symrot(uv,6.)-vec2(2.,.0); // 4
    // 3 fold rotation
	uv = symrot(uv,3.)-vec2(1.,0.); // 3
    // 3 fold rotation
	uv = symrot(uv,3.)-vec2(.5,.0); // 2
	
    // reflection on the y axis with a flip on the x to do an interlace
	uv = vec2(sign(uv.y)*uv.x,abs(uv.y))-vec2(0.,.4+.05*cos(iTime+uv.x*6.28)); // 1
    // if you want to see how the pattern is constructed
    // comment all the lines 1 to 4, and then uncomment one by one 1,2,3,4
	
    // draw the pattern
	return pattern(uv);
}


void main()
{
    vec2 uv = ( gl_FragCoord.xy - iResolution.xy*.5)/ iResolution.y ;
    gl_FragColor = vec4( scene(uv), backgroundAlpha );
    // uncomment to see the original pattern    
    //fragColor = vec4( pattern(uv*2.), 1.0 ); 
}