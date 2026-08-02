import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'

// ---------------------------------------------------------
// POST-PROCESSING IMPORTS
// ---------------------------------------------------------

// EffectComposer manages the complete post-processing pipeline.
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'

// RenderPass renders our normal Three.js scene into the
// post-processing pipeline.
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'

import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

// ShaderPass allows us to use a GLSL shader as a post-processing effect.
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'

import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

import * as dat from 'dat.gui'
import './style.css'


const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()


// ---------------------------------------------------------
// LOADERS
// ---------------------------------------------------------

const gltfLoader = new GLTFLoader()
const exrLoader = new EXRLoader()


// ---------------------------------------------------------
// SCREEN SIZE
// ---------------------------------------------------------

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// ---------------------------------------------------------
// CAMERA
// ---------------------------------------------------------

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)

camera.position.set(4, 1, -4)

scene.add(camera)


// ---------------------------------------------------------
// ORBIT CONTROLS
// ---------------------------------------------------------

const controls = new OrbitControls(camera, canvas)

controls.enableDamping = true


// ---------------------------------------------------------
// RENDERER
// ---------------------------------------------------------

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

renderer.outputColorSpace = THREE.SRGBColorSpace

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5

renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)


// ---------------------------------------------------------
// MATERIAL UPDATE
// ---------------------------------------------------------

const updateAllMaterials = () => {

    scene.traverse((child) => {

        if (child instanceof THREE.Mesh) {

            if (Array.isArray(child.material)) {

                child.material.forEach((material) => {

                    if (material instanceof THREE.MeshStandardMaterial) {

                        material.envMapIntensity = 5

                        material.needsUpdate = true
                    }
                })

            } else if (
                child.material instanceof THREE.MeshStandardMaterial
            ) {

                child.material.envMapIntensity = 5

                child.material.needsUpdate = true
            }

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}


// ---------------------------------------------------------
// LIGHT
// ---------------------------------------------------------

const directionalLight =
    new THREE.DirectionalLight('#ffffff', 3)

directionalLight.castShadow = true

directionalLight.shadow.mapSize.set(1024, 1024)

directionalLight.shadow.camera.far = 15

directionalLight.shadow.normalBias = 0.05

directionalLight.position.set(
    0.25,
    3,
    -2.25
)

scene.add(directionalLight)


// ---------------------------------------------------------
// ENVIRONMENT MAP
// ---------------------------------------------------------

const loadEnvironmentMap = async () => {

    const environmentMap =
        await exrLoader.loadAsync(
            '/textures/environmentMaps/walkWay/venetian_crossroads_2k.exr'
        )

    environmentMap.mapping =
        THREE.EquirectangularReflectionMapping

    scene.background = environmentMap

    scene.environment = environmentMap

    return environmentMap
}


// ---------------------------------------------------------
// HELMET
// ---------------------------------------------------------

const loadHelmet = async () => {

    const gltf =
        await gltfLoader.loadAsync(
            '/models/DamagedHelmet/glTF/DamagedHelmet.gltf'
        )

    gltf.scene.scale.set(2, 2, 2)

    gltf.scene.rotation.y = Math.PI * 0.5

    scene.add(gltf.scene)

    updateAllMaterials()

    return gltf.scene
}


// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------

const init = async () => {

    try {

        await loadEnvironmentMap()

        await loadHelmet()

        console.log('Environment map loaded')
        console.log('Helmet loaded')

    } catch (error) {

        console.error('Loading error:', error)
    }
}


// =========================================================
// POST-PROCESSING
// =========================================================
//
// Normal rendering:
//
// renderer.render(scene, camera)
//
// Post-processing rendering:
//
// scene
//   ↓
// RenderPass
//   ↓
// Pass 1
//   ↓
// Pass 2
//   ↓
// Pass 3
//   ↓
// Screen
//
// EffectComposer manages this entire chain.
// =========================================================


// ---------------------------------------------------------
// RENDER TARGET
// ---------------------------------------------------------
//
// A WebGLRenderTarget is basically a texture that WebGL can
// render into.
//
// Instead of:
//
// Scene → Screen
//
// we do:
//
// Scene → RenderTarget → Post Processing → Screen
//
// This allows shaders to read the rendered image.
// ---------------------------------------------------------

const renderTarget =
    new THREE.WebGLRenderTarget(
        800,
        600,
        {
            samples:
                renderer.getPixelRatio() == 1
                    ? 2
                    : 0
        }
    )


// ---------------------------------------------------------
// EFFECT COMPOSER
// ---------------------------------------------------------
//
// EffectComposer manages all post-processing passes.
//
// Every pass is added in order.
//
// The order matters!
// ---------------------------------------------------------

const effectComposer =
    new EffectComposer(
        renderer,
        renderTarget
    )

effectComposer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)

effectComposer.setSize(
    sizes.width,
    sizes.height
)


// ---------------------------------------------------------
// RENDER PASS
// ---------------------------------------------------------
//
// This is the FIRST step.
//
// It renders our normal Three.js scene.
//
// Scene + Camera
//      ↓
// RenderPass
//      ↓
// Rendered image
// ---------------------------------------------------------

const renderPass =
    new RenderPass(scene, camera)

effectComposer.addPass(renderPass)


// ---------------------------------------------------------
// DOT SCREEN
// ---------------------------------------------------------
//
// Creates a halftone/dot style effect.
//
// Currently disabled so it doesn't affect the image.
// ---------------------------------------------------------

const dotScreenPass =
    new DotScreenPass()

dotScreenPass.enabled = false

effectComposer.addPass(dotScreenPass)


// ---------------------------------------------------------
// GLITCH
// ---------------------------------------------------------
//
// Creates digital glitch distortion.
// ---------------------------------------------------------

const glitchPass =
    new GlitchPass()

glitchPass.enabled = false

glitchPass.goWild = false

effectComposer.addPass(glitchPass)


// ---------------------------------------------------------
// OUTPUT PASS
// ---------------------------------------------------------
//
// Used for final output/color management.
// Currently disabled while learning.
// ---------------------------------------------------------

const outputPass =
    new OutputPass()

outputPass.enabled = false

effectComposer.addPass(outputPass)


// ---------------------------------------------------------
// RGB SHIFT
// ---------------------------------------------------------
//
// Separates RGB channels to create chromatic aberration.
// ---------------------------------------------------------

const rgbShiftPass =
    new ShaderPass(RGBShiftShader)

rgbShiftPass.enabled = false

effectComposer.addPass(rgbShiftPass)


// ---------------------------------------------------------
// UNREAL BLOOM
// ---------------------------------------------------------
//
// Makes bright areas glow.
// ---------------------------------------------------------

const resolution =
    new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
    )

const unrealBloomPass =
    new UnrealBloomPass(
        resolution,
        0.3, // strength
        1,   // radius
        0.6  // threshold
    )

effectComposer.addPass(unrealBloomPass)


// GUI controls for Bloom

gui.add(
    unrealBloomPass,
    "enabled"
).name("UnrealBloom")

gui.add(
    unrealBloomPass,
    "strength"
).min(0).max(2).step(0.001)

gui.add(
    unrealBloomPass,
    "radius"
).min(0).max(2).step(0.001)

gui.add(
    unrealBloomPass,
    "threshold"
).min(0).max(1).step(0.001)


// =========================================================
// CUSTOM POST-PROCESSING SHADER
// =========================================================
//
// We are now creating our OWN post-processing effect.
//
// The important idea:
//
// Previous Pass
//      ↓
// tDiffuse
//      ↓
// GLSL modifies image
//      ↓
// gl_FragColor
// =========================================================

const TintShader = {

    uniforms: {

        // tDiffuse is automatically connected by ShaderPass.
        //
        // It contains the image produced by the previous pass.
        tDiffuse: {
            value: null
        },

        // Our custom uniform.
        //
        // JavaScript can change this value and GLSL receives it.
        uTint: {
            value: null
        }
    },


    // -----------------------------------------------------
    // VERTEX SHADER
    // -----------------------------------------------------
    //
    // Post-processing uses a full-screen plane.
    //
    // We pass the UV coordinates from the vertex shader
    // to the fragment shader.
    // -----------------------------------------------------

    vertexShader: `

        varying vec2 vUv;

        void main() {

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);

            vUv = uv;
        }
    `,


    // -----------------------------------------------------
    // FRAGMENT SHADER
    // -----------------------------------------------------
    //
    // This shader runs for every pixel.
    // -----------------------------------------------------

    fragmentShader: `

        // The previous rendered image.
        uniform sampler2D tDiffuse;

        // Custom RGB tint.
        uniform vec3 uTint;

        // UV coordinate for the current pixel.
        varying vec2 vUv;


        void main() {

            // Read the previous pass's pixel color.
            vec4 color =
                texture2D(
                    tDiffuse,
                    vUv
                );


            // Modify RGB.
            //
            // uTint.x = red
            // uTint.y = green
            // uTint.z = blue
            //
            color.rgb += uTint;


            // Output the modified pixel.
            gl_FragColor = color;
        }
    `
}


// ---------------------------------------------------------
// CREATE SHADER PASS
// ---------------------------------------------------------

const tintPass =
    new ShaderPass(TintShader)


// Create the initial tint value.
//
// x = red
// y = green
// z = blue

tintPass.material.uniforms.uTint.value =
    new THREE.Vector3()


effectComposer.addPass(tintPass)


// ---------------------------------------------------------
// GUI → GLSL
// ---------------------------------------------------------
//
// These GUI controls modify the uniform.
//
// JavaScript
//    ↓
// uTint
//    ↓
// GLSL
// ---------------------------------------------------------

gui.add(
    tintPass.material.uniforms.uTint.value,
    'x'
)
.min(-1)
.max(1)
.step(0.001)
.name("red")


gui.add(
    tintPass.material.uniforms.uTint.value,
    'y'
)
.min(-1)
.max(1)
.step(0.001)
.name("green")


gui.add(
    tintPass.material.uniforms.uTint.value,
    'z'
)
.min(-1)
.max(1)
.step(0.001)
.name("blue")


// =========================================================
// CUSTOM DISPLACEMENT PASS
// =========================================================
//
// Currently this is a PASS-THROUGH shader.
//
// It reads the previous image and outputs it unchanged.
//
// Later we can modify the UV coordinates to create
// distortion.
// =========================================================

const DisplacementShader = {

    uniforms: {

        // Previous pass image.
        tDiffuse: {
            value: null
        }
    },


    vertexShader: `

        varying vec2 vUv;

        void main() {

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);

            vUv = uv;
        }
    `,


    fragmentShader: `

        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main() {

            // Start with original UV.
            vec2 newUv = vUv;


            // Read the previous image.
            vec4 color =
                texture2D(
                    tDiffuse,
                    newUv
                );


            // Output unchanged image.
            gl_FragColor = color;
        }
    `
}


const displacementPass =
    new ShaderPass(DisplacementShader)

effectComposer.addPass(displacementPass)


// ---------------------------------------------------------
// SMAA
// ---------------------------------------------------------
//
// Anti-aliasing pass.
// Helps smooth jagged edges.
// ---------------------------------------------------------

if (
    renderer.getPixelRatio() == 1 &&
    !renderer.capabilities.isWebGL2
) {

    const smaaPass =
        new SMAAPass()

    effectComposer.addPass(smaaPass)

    console.log("SMAA PASS")
}


// ---------------------------------------------------------
// GAMMA CORRECTION
// ---------------------------------------------------------

const gammaCorrectionPass =
    new ShaderPass(
        GammaCorrectionShader
    )

effectComposer.addPass(
    gammaCorrectionPass
)


// ---------------------------------------------------------
// CLOCK
// ---------------------------------------------------------

const clock =
    new THREE.Clock()


// ---------------------------------------------------------
// ANIMATION LOOP
// ---------------------------------------------------------

const tick = () => {

    const elapsedTime =
        clock.getElapsedTime()


    // Later, time can be passed to custom shaders.
    //
    // Example:
    //
    // displacementPass.material.uniforms.uTime.value =
    //     elapsedTime


    // IMPORTANT:
    //
    // We DO NOT call:
    //
    // renderer.render(scene, camera)
    //
    // because EffectComposer is now responsible
    // for rendering the scene and applying passes.

    effectComposer.render()


    controls.update()


    window.requestAnimationFrame(tick)
}


init()

tick()