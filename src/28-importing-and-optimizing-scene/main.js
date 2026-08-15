import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(4, 2, 4)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})
renderer.setSize(
    sizes.width,
    sizes.height
)
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)
renderer.outputColorSpace = THREE.SRGBColorSpace

/**
 * Loaders
 */
// Texture
const textureLoader = new THREE.TextureLoader()

// Draco
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

// GLTF
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Load assets
 */
const loadScene = async () => {

    try {

        const [gltf, bakedTexture] = await Promise.all([
            gltfLoader.loadAsync('/models/portal/portal.glb'),
            textureLoader.loadAsync('/models/portal/baked.jpg')
        ])

        console.log(gltf)
        console.log(bakedTexture)

        /**
         * Baked texture
         * flipY is disabled because GLTF uses the UV orientation
         * expected by the baked texture.
         * sRGB is used because baked.jpg contains color information.
         */
        bakedTexture.colorSpace = THREE.SRGBColorSpace
        bakedTexture.flipY = false

        /**
         * Baked material
         * MeshBasicMaterial is used because lighting is already
         * baked into the texture, so real-time lighting is unnecessary.
         */
        const bakedMaterial = new THREE.MeshBasicMaterial({
            map: bakedTexture
        })

        /**
         * Portal & Pole Light material
         * These objects are kept separate from the baked mesh so
         * their appearance can be controlled independently.
         */
        const portalLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        })

        const poleLightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffe5
        })

        /**
         * Get the four objects exported from Blender
         */
        const bakedMesh = gltf.scene.getObjectByName('baked')
        const portalLightMesh = gltf.scene.getObjectByName('portalLight')
        const poleLightAMesh = gltf.scene.getObjectByName('poleLightA')
        const poleLightBMesh = gltf.scene.getObjectByName('poleLightB')

        /**
         * Apply materials
         */
        bakedMesh.material = bakedMaterial
        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial

        /**
         * Add model
         */
        scene.add(gltf.scene)

        /**
         * Calculate model bounds
         */
        const box = new THREE.Box3().setFromObject(gltf.scene)

        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        console.log('Model center:', center)
        console.log('Model size:', size)

        controls.target.copy(center)
        controls.update()
    }
    catch (error) {
        console.error('Error loading portal scene:', error)
    }
}
loadScene()

/**
 * Animation
 */
const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

/**
 * Resize
 */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(
        sizes.width,
        sizes.height
    )
    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})

/**
 * SCENE IMPORT & OPTIMIZATION SUMMARY
 *
 * Blender:
 * - Static environment objects are merged into one "baked" mesh.
 * - The baked mesh keeps its UV coordinates so every object uses
 *   the correct area of the single baked.jpg texture.
 * - portalLight, poleLightA and poleLightB remain separate so
 *   they can have their own materials and be controlled independently.
 * - The GLB is Draco compressed to reduce file size and loading time.
 *
 * Three.js:
 * - GLTFLoader loads the optimized Blender scene.
 * - DRACOLoader decompresses the Draco-compressed geometry.
 * - TextureLoader loads the external baked.jpg texture.
 * - Promise.all() loads the GLB and texture in parallel.
 * - The baked texture uses sRGB color space for correct colors.
 * - flipY = false matches the GLTF UV orientation.
 * - MeshBasicMaterial is used for the baked scene because lighting
 *   is already stored inside the baked texture.
 * - The merged baked mesh greatly reduces the number of objects
 *   and draw calls compared with many separate static meshes.
 * - Only the three light meshes use separate materials.
 * - Frustum culling remains enabled by default.
 * - Device pixel ratio is capped at 2 to prevent unnecessarily
 *   high rendering resolution on high-DPI displays.
 * - The scene uses async GLTF loading so the main thread is not
 *   blocked while waiting for the assets to load.
 */