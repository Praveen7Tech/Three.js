import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'stats.js'
import './style.css'
import { quadBroadcast } from 'three/src/nodes/TSL.js'
const canvas = document.querySelector('canvas.webgl')

/**
 * Stats.js
 * Displays performance information such as FPS
 * and frame rendering time.
 */
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)


const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

/**
 * Canvas size
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 * PerspectiveCamera creates a realistic perspective view.
 *
 * 45  -> field of view
 * aspect -> screen width / height
 * 0.1 -> near clipping plane
 * 100 -> far clipping plane
 */
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
)

camera.position.set(7, 4.5, 9)
scene.add(camera)

/**
 * Renderer
 * Converts the Three.js scene into pixels using WebGL.
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
})

/**
 * Add the "webgl" class to the canvas.
 * This is required because style.css targets .webgl.
 */

renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2))

/**
 * Enable shadows.
 *
 * Shadows are relatively expensive because
 * Three.js needs additional rendering passes.
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * OrbitControls
 *
 * Allows the user to:
 * - rotate around the scene
 * - zoom
 * - pan
 *
 * The camera is controlled by OrbitControls.
 */
const controls = new OrbitControls(camera,canvas)

/**
 * Damping makes camera movement smooth.
 */
controls.enableDamping = true

/**
 * Point the controls toward the center
 * of our objects.
 */
controls.target.set(0, 0, 0)

/**
 * Minimum and maximum zoom distance.
 */
// controls.minDistance = 5
// controls.maxDistance = 15


/**
 * Material
 */
const material = new THREE.MeshStandardMaterial()


/**
 * Floor
 *
 * Large plane used to receive shadows.
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)

floor.rotation.x = -Math.PI * 0.5
floor.position.y = -1

floor.castShadow = false;
floor.receiveShadow = true
scene.add(floor)


/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    material
)

cube.position.set(-3, 0.5, 0)

cube.castShadow = true
cube.receiveShadow = false

scene.add(cube)


/**
 * Sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    material
)

sphere.position.set(3, 0.5, 0)

sphere.castShadow = true
sphere.receiveShadow = false

scene.add(sphere)

/**
 * Torus
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(
        1,  // radius
        0.4, // tube radius
        128,  // tubular segments
        32,   // radial segments
        2,    // p
        3     // q
    ),
    material
)

torusKnot.position.set(0, 1, 0)
torusKnot.castShadow = true
torusKnot.receiveShadow = false
scene.add(torusKnot)


/**
 * Directional Light
 */
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    4
)

directionalLight.position.set(3, 6, 4)

directionalLight.castShadow = true

/**
 * Shadow map resolution.
 *
 * Higher resolution = better shadows
 * but more GPU cost.
 */
directionalLight.shadow.mapSize.set( 1024,1024)

directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 12

scene.add(directionalLight)


/**
 * Ambient light
 */
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.15
)

scene.add(ambientLight)

const clock = new THREE.Clock()

const tick = () => {

    stats.begin()
    const elapsedTime = clock.getElapsedTime()

    // Slowly rotate the Torus Knot
    torusKnot.rotation.x = elapsedTime * 0.12
    torusKnot.rotation.y = elapsedTime * 0.18

    controls.update()
    renderer.render(scene, camera)
    stats.end()

    window.requestAnimationFrame(tick)
}

tick()


/**
 * Handle browser resizing.
 */
window.addEventListener('resize', () => {

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2))
})

/**
 * Tips to monitor performance
 */

// Tip 1
// console.log(renderer.info)

// Tip 2 (dispose properly not make memmory leak)

// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// Tip 3 (shadow map perfectly fit in the scene)

// directionalLight.shadow.mapSize.set( 1024,1024)
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.left = -6
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.bottom = -3
// directionalLight.shadow.camera.near = 0.1
// directionalLight.shadow.camera.far = 12

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// Tip 4 (use castshadow and recieve shadow wisely)

// cube.castShadow = true;
// cube.receiveShadow = false

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false

// sphere.castShadow = true;
// sphere.receiveShadow = false

// floor.castShadow = false;
// floor.receiveShadow = true

// Tip 5 (deactivate shadow auto update)

// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// Tip 6 (resize textures)

// Textures take lot of space in the GPU Memmory especially with the mipmaps
// the texture file weight nothing to do with that , and only the resolution matters
// try to reduce the resolution to the minimum while keeping a decent result.

// The texture does NOT need to be square.
// Each dimension can independently be a power of two.
//
// Modern WebGL supports non-power-of-two textures,
// so Three.js does not simply resize every NPOT texture
// to the nearest power of two. However, NPOT textures
// have some restrictions depending on mipmaps and wrapping.
//
// Therefore, when optimizing textures, choose a resolution
// appropriate for the object's size on screen instead of
// automatically using very large textures.

// TIP 6 (Use th right format files)
// use formats (.jpg, .png) according to image and compression
// use website "tinypng.com" reduce the file size
// reduce the total website file size to the end

// we can use basis format, its compression is realy powerfull- but defficult to generate

// Tip 7 (MUTUALIZE GEOMETRY)
// sharing the same geometry between multiple objects instead of creating a separate geometry for every object.

// Tip 8 (Merge geometry using - BufferGeometryUtils)

//Merge multiple geometries into one BufferGeometry
// This allows multiple static objects to be rendered as one mesh.
// The main benefit is reducing draw calls, which improves rendering performance.
// The number of vertices/triangles is not automatically reduced.
// Best for objects that do not need to move, rotate, or scale independently.

// Tip 9 (Use InstancedMesh )
// reuse one geometry many times also indipended acces of each object that not supprot in the Merging multiple geometry using  - ufferGeometryUtils

// const Tempgeometry = new THREE.BoxGeometry()
// const Tempmaterial = new THREE.MeshNormalMaterial()
// const mesh = new THREE.InstancedMesh(
//     Tempgeometry,
//     Tempmaterial,
//     50
// )
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

// const matrix = new THREE.Matrix4()
// for(let i = 0; i < 50; i++){
//     const position = new THREE.Vector3(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )
//     const quaternion = new THREE.Quaternion()
//     quaternion.setFromEuler(
//         new THREE.Euler(
//             Math.random() * Math.PI,
//             Math.random() * Math.PI,
//             Math.random() * Math.PI
//         )
//     )
//     const scale = new THREE.Vector3(1, 1, 1)
//     matrix.compose(position,quaternion,scale)
//     mesh.setMatrixAt(i, matrix)
// }
// scene.add(mesh)


// Tip 10 (use Low poly)

// TIP 11 (use Draco compression)
// if the model have lot of details with very complex geomtries use draco compression
// the drawbacks are a potential freze from uncompressing the geometry, also need to load draco library

// Tip Use GZIP - (it is a compression happeing on the serverside)
// most of the servers don't gzip files as .glb, .gltf, .obj
// if can figure ou to fix that based on the server we using

// Tip 12 (Power ppreferences)

// some devices switch between defferent GPU's, give a hint what power need to use
// aslo dont have any frame rate issue dont use it.

// const renderer = new THREE.WebGLRenderer({
//     canvas,
//     antialias: true,
//     powerPreference: "high-performance"
// })

/**
 * Post Processing
 */

// Tip 13 (Use Less passes)

// each post processing passes will take as many pixels as the render's resolution(inlcuding the pixel ratio) to render

/**
 * Shaders
 */

// Tip 14 (Shaders optimization)

// use lowp for presion it will provide best performance
//  (precision: "lowp")

// Tip 15 (try not to use if statements in glsl) either use, clamp() or max()

// Tip 16 (try to avoid perlin noise)
// try to use image texture rathethan perlin noise that make huge defference in performance ratherthan complex perlin formula imgage texture work best performance

// Tip 17 (using #define)
// using #define instead of a uniform for values that never change can improve performance, becuase if use uniforms the value need to import from the cpu to gpu so using the #define not need transfer data the value baking in side the shader itself

// Tip 18 (do calculations in the vertex)
// do the calculations in the vertex shader and pass to the fragment shader using varying