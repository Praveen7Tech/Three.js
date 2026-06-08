import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

// LIGHTS & SHADOW

////////////////////////

// 1
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// improve the shadow camera ampitude psitioning (make better shadow avoid glitchs)
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.bottom = -1
directionalLight.shadow.camera.left = 1
directionalLight.shadow.camera.right = -1
directionalLight.shadow.camera.near = 1  
directionalLight.shadow.camera.far = 5
directionalLight.shadow.radius = 20  // shadow blur

const directionalLightShadowCamers = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightShadowCamers)

///////////////////////

// 2

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.position.set(-1,2,2)

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30  // field of view
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5

scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
//scene.add(spotLightCameraHelper)

///////////////////

// 3

const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 0.1
spotLight.shadow.camera.far = 5

pointLight.position.set(-1,1,0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
//scene.add(pointLightCameraHelper)

////////////////////

const material = new THREE.MeshStandardMaterial()
material.side = THREE.DoubleSide
material.roughness = 0.4

const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32)
const planeGeometry = new THREE.PlaneGeometry(5, 5)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true    // allow shadoe effect to applay
const plane = new THREE.Mesh(planeGeometry, material)
plane.receiveShadow = true   // allow to reciece other objects shadow relection

scene.add(sphere, plane)
plane.rotation.x = Math.PI * 0.5
plane.position.y = -0.65

/////////////////
// SHADOW BACKING USING ANOTHER SHAPE

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5,1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000       // use texture meterial (alpha) ratherthan color
  })
)

sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)


/////////////////

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.getPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = false;

const clock = new THREE.Clock()

const animation = () =>{
  
  const elapsedTime = clock.getElapsedTime()
  // UPDATE SPHERE
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 2))

  // UPDATE SHADOW
  sphereShadow.position.x = sphere.position.x
  sphereShadow.position.z = sphere.position.z
  sphereShadow.material.opacity = 1 - sphere.position.y  - // (use meterial ratherthan colr it get better shadow result)

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}

animation()

