import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// GLTF & DRACO Loader // Optional: Provide a DRACOLoader instance to decode compressed mesh data
const loader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
// loader.setDRACOLoader( dracoLoader );
let mixer = null
const gltf = await loader.loadAsync( 'models/Fox/glTF/Fox.gltf' );
gltf.scene.scale.set(0.025,0.025,0.025)
mixer = new THREE.AnimationMixer(gltf.scene)
const action = mixer.clipAction(gltf.animations[1])
action.play()
scene.add( gltf.scene );

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#444444"
    })
)

floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true

scene.add(floor)

// AmbientLight
const ambientLight = new THREE.AmbientLight("#ffffff", 3)

scene.add(ambientLight)

// Optional shadow camera helper
// const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(helper)

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)

camera.position.set(4, 4, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(
    camera,
    canvas
)

controls.enableDamping = true

// Renderer
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

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Resize
window.addEventListener("resize", () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect =
        sizes.width / sizes.height

    camera.updateProjectionMatrix()

    renderer.setSize(
        sizes.width,
        sizes.height
    )

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})

// Animation

const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update the animation mixer
    if(mixer){
        mixer.update(deltaTime)
    }

    controls.update()

    renderer.render(
        scene,
        camera
    )

    requestAnimationFrame(tick)
}

tick()