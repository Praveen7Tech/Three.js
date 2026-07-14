/*-------------------------------------------------------
 Fragment Shader

 Runs once for every pixel.

 Responsibilities:
 - Calculate final color
 - Apply textures
 - Apply lighting manually (if desired)
-------------------------------------------------------*/


/*-------------------------------------------------------
 Automatically added by ShaderMaterial

precision mediump float;

-------------------------------------------------------*/


/*-------------------------------------------------------
 Uniforms
-------------------------------------------------------*/

uniform vec3 uColor;

uniform sampler2D uTexture;


/*-------------------------------------------------------
 Varyings received from Vertex Shader
-------------------------------------------------------*/

// varying float vRandom;

varying vec2 vUv;

varying float vElevation;


void main()
{

    //---------------------------------------------------
    // Read texture color
    //---------------------------------------------------

    vec4 textureColor = texture2D(uTexture,vUv);

    //---------------------------------------------------
    // Fake lighting using elevation
    //---------------------------------------------------

    textureColor.rgb *= vElevation * 1.0 + 0.5;

    //---------------------------------------------------
    // Solid Color Example
    //---------------------------------------------------

    // gl_FragColor = vec4(uColor, 1.0);

    //---------------------------------------------------
    // Final Output
    //---------------------------------------------------

    gl_FragColor = textureColor;
}