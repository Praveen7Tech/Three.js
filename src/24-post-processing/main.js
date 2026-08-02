import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import * as dat from 'dat.gui'
import './style.css'

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()
const exrLoader = new EXRLoader()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, -4)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMapIntensity = 5
                child.material.needsUpdate = true
            }

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

const lightFolder = gui.addFolder('Directional Light')
lightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.01)
lightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01)
lightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01)
lightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01)

const loadEnvironmentMap = async () => {
    const environmentMap = await exrLoader.loadAsync(
        '/textures/environmentMaps/walkWay/venetian_crossroads_2k.exr'
    )

    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap

    return environmentMap
}

const loadHelmet = async () => {
    const gltf = await gltfLoader.loadAsync(
        '/models/DamagedHelmet/glTF/DamagedHelmet.gltf'
    )

    gltf.scene.scale.set(2, 2, 2)
    gltf.scene.rotation.y = Math.PI * 0.5

    scene.add(gltf.scene)

    updateAllMaterials()

    return gltf.scene
}

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

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Post processing
 */

// Render Target
const renderTarget = new THREE.WebGLRenderTarget(800,600,
    {
        samples: renderer.getPixelRatio() == 1 ? 2 : 0
    }
)

// Effect Composer
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

// Render pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// Dot Screen pass
const dotScrenPass = new DotScreenPass()
dotScrenPass.enabled = false
effectComposer.addPass(dotScrenPass)

// Glitch pass
const glitchPass = new GlitchPass()
glitchPass.enabled = false
glitchPass.goWild = false
effectComposer.addPass(glitchPass)


// outPut pass
const outputPass = new OutputPass()
outputPass.enabled = false
effectComposer.addPass( outputPass );

// RGBShift pass
const rgbShiftPass = new ShaderPass( RGBShiftShader );
rgbShiftPass.enabled = false
effectComposer.addPass( rgbShiftPass );

// Unreal Bloom Pass
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight)
const unrealBloomPass = new UnrealBloomPass(resolution, 0.3, 1, 0.6)
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, "enabled").name("UnrealBloom")
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.001)
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.001)
gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.001)


// Tint Pass (Custom shader or pass)
const TintShader ={
    uniforms:{
        tDiffuse:{value: null},
        uTint: {value: null}
    },
    vertexShader:`
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;
        varying vec2 vUv;

        void main(){
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;

            gl_FragColor = color;
        }
    `
}
const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)

gui.add(tintPass.material.uniforms.uTint.value, 'x').min(-1).max(1).step(0.001).name("red")
gui.add(tintPass.material.uniforms.uTint.value, 'y').min(-1).max(1).step(0.001).name("green")
gui.add(tintPass.material.uniforms.uTint.value, 'z').min(-1).max(1).step(0.001).name("blue")

// Displacement Pass (Custom shader or pass)
const DisplacementShader ={
    uniforms:{
        tDiffuse:{value: null},
    },
    vertexShader:`
        varying vec2 vUv;

        void main(){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader:`
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main(){
            vec2 newUv = vUv;
            vec4 color = texture2D(tDiffuse, newUv);

            gl_FragColor = color;
        }
    `
}
const displacementPass = new ShaderPass(DisplacementShader)
effectComposer.addPass(displacementPass)

/// SMAA Pass
if(renderer.getPixelRatio() == 1 && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)
    console.log("SMAA PASS")
}

// Gamma correction pass
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammaCorrectionPass)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // Update passes
    //displacementPass.uniforms.uTime.value = elapsedTime

    //renderer.render(scene, camera)
    effectComposer.render()
    controls.update()
    window.requestAnimationFrame(tick)
}

init()
tick()