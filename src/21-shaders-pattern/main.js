import "./style.css";
import * as THREE from "three";
// GLSL Shaders
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const canvas = document.querySelector('canvas.webgl')
const sizez ={
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizez.width / sizez.height, 0.1, 100)
camera.position.set(0,0,3)
scene.add(camera)

const textureLoader = new THREE.TextureLoader()
const meshTexture = textureLoader.loadAsync(' "textures/flag/indianFlag.avif"')

const geometry = new THREE.PlaneGeometry(2,2,)
console.log(geometry.attributes)

const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader:testVertexShader,
    fragmentShader:testFragmentShader,
    //wireframe: true
})

const plane = new THREE.Mesh(
    geometry,
    material
)
plane.scale.y = 2/2
scene.add(plane)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({canvas, antialias: true})
renderer.setSize(sizez.width, sizez.height)
renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2))


window.addEventListener('resize', ()=>{
     sizez.width = window.innerWidth;
     sizez.height = window.innerHeight;

     camera.aspect = sizez.width / sizez.height;

     camera.updateProjectionMatrix();

     renderer.setSize(sizez.width, sizez.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function animate(){

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()
