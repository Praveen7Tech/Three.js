import "./style.css"
import * as THREE from "three"
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js"

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('canvas.webgl')

// ---------------------------------------
// Scene
// ---------------------------------------
const scene = new THREE.Scene()

// ---------------------------------------
// Environment Map
// ---------------------------------------

// const environmentMap = new THREE.CubeTextureLoader.load({

// })

// ---------------------------------------
// Camera
// ---------------------------------------
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height, 0.1, 100)
camera.position.set(4,3,6)

scene.add(camera)

// ---------------------------------------
// Renderer
// ---------------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLight = true
renderer.outputEncoding = THREE.sRGBEncoding

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


// ---------------------------------------
// Orbit Controls
// ---------------------------------------
const controller =  new OrbitControls(camera, canvas)
controller.enableDamping = true

// ---------------------------------------
// Lights
// ---------------------------------------

//Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff,3)
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff,3)
directionalLight.position.set(5,10,5)
directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.bottom = -10
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 30

directionalLight.shadow.normalBias = 0.02  // maintain the object stop the shadow of itself on the object

scene.add(directionalLight)

// ---------------------------------------
// Directional Light Camera/Shadow helpers
// ---------------------------------------
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1
)
scene.add(directionalLightHelper)

// ---------------------------------------
// Floor
// ---------------------------------------

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({color: "#444444"})
)

floor.rotation.x = -Math.PI / 2

floor.receiveShadow = true

scene.add(floor)

// ---------------------------------------
// Axes Helper
// ---------------------------------------

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// ---------------------------------------
// Grid Helper
// ---------------------------------------

const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// ---------------------------------------
// Load Blender Models
// ---------------------------------------
const loader = new GLTFLoader()

// Burger
const burger = await loader.loadAsync('models/Burger/hamburger1.glb')
burger.scene.scale.set(0.5,0.5,0.5)

burger.scene.traverse((child)=>{
    if(child.isMesh){
        child.castShadow = true
        child.receiveShadow = true
    }
})
scene.add(burger.scene)

// Flight helmet
const flightHelmet = await loader.loadAsync('models/FlightHelmet/glTF/FlightHelmet.gltf')
flightHelmet.scene.scale.set(5,5,5)

flightHelmet.scene.traverse((child)=>{
    if(child.isMesh){
        child.castShadow = true
        child.receiveShadow = true
    }
})

//scene.add(flightHelmet.scene)

// ---------------------------------------
// Resize
// ---------------------------------------

window.addEventListener("resize",()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height

    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ---------------------------------------
// Animation Loop
// ---------------------------------------

function Animation(){
    requestAnimationFrame(Animation)

    controller.update()

    renderer.render(scene, camera)
}

Animation()