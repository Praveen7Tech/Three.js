import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

// LIGHTS

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
//scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.7)
directionalLight.position.set(1, 0.25, 0)
//scene.add(directionalLight)

const hemiSphereLight = new THREE.HemisphereLight("red", "green", 1)
//scene.add(hemiSphereLight)

const pointLight = new THREE.PointLight("blue", 1, 10)
pointLight.position.set(1, 0.5, 1)
//scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight("pink",2,1,5)  // (like stage bottom light projection)
rectAreaLight.position.set(-1.4,0,1)
rectAreaLight.lookAt(new THREE.Vector3())
//scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight("green", 1, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

const material = new THREE.MeshStandardMaterial()
material.side = THREE.DoubleSide
material.roughness = 0.4

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const cubeGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
const planeGeometry = new THREE.PlaneGeometry(5, 5)

const sphere = new THREE.Mesh(sphereGeometry, material)
const cube = new THREE.Mesh(cubeGeometry, material)
const torus = new THREE.Mesh(torusGeometry, material)
const plane = new THREE.Mesh(planeGeometry, material)

scene.add(sphere, cube, torus, plane)
sphere.position.x = -1.5
torus.position.x = 1.5
plane.rotation.x = Math.PI * 0.5
plane.position.y = -0.65

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)

const animation = () =>{
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}

animation()

