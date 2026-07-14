/*-------------------------------------------------------
 Vertex Shader

 Runs once for every vertex.

 Responsibilities:
 - Move vertices
 - Create animations
 - Pass data to Fragment Shader
-------------------------------------------------------*/


/*-------------------------------------------------------
 Automatically provided by ShaderMaterial

 These uniforms are injected automatically,
 so they do NOT need to be declared manually.

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

-------------------------------------------------------*/


/*-------------------------------------------------------
 Custom Uniforms
-------------------------------------------------------*/

uniform vec2 uFrequency;
uniform float uTime;


/*-------------------------------------------------------
 Automatically provided Attributes

attribute vec3 position;
attribute vec2 uv;

-------------------------------------------------------*/


/*-------------------------------------------------------
 Custom Attribute

 One random value per vertex.

attribute float aRandom;

-------------------------------------------------------*/


/*-------------------------------------------------------
 Varyings

 Used to pass data from Vertex Shader
 to Fragment Shader.
-------------------------------------------------------*/

// varying float vRandom;

varying vec2 vUv;
varying float vElevation;


void main()
{

    //---------------------------------------------------
    // Default transformation
    //---------------------------------------------------

    // gl_Position = projectionMatrix
    // * viewMatrix
    // * modelMatrix
    // * vec4(position, 1.0);

    //---------------------------------------------------
    // Model Space
    //---------------------------------------------------

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //---------------------------------------------------
    // Wave Animation
    //---------------------------------------------------

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.2;

    elevation +=  sin(modelPosition.y * uFrequency.y - uTime) * 0.2;

    modelPosition.z += elevation;

    //---------------------------------------------------
    // Custom Attribute Example
    //---------------------------------------------------

    // modelPosition.z += aRandom * 0.1;

    //---------------------------------------------------
    // Convert Spaces
    //---------------------------------------------------

    vec4 viewPosition =
        viewMatrix * modelPosition;

    vec4 projectedPosition =
        projectionMatrix * viewPosition;

    gl_Position =  projectedPosition;

    //---------------------------------------------------
    // Send values to Fragment Shader
    //---------------------------------------------------

    // vRandom = aRandom;

    vUv = uv;

    vElevation = elevation;
}