import "./style.css"
import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

/**
 * DEBUG UI
 */
const gui = new dat.GUI()

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const doorColorTexture = textureLoader.load("/door.jpg")
const matcapMeterial = textureLoader.load('/matcap3.jpg')
const gradientTexture = textureLoader.load("/gradient2.jpg")
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter


const cursor = {
  x: 0,
  y: 0
}


const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

// 1 - MESH BASIC METERIAL
// const meterial = new THREE.MeshBasicMaterial()
// meterial.color = new THREE.Color("red")
 //meterial.map = doorColorTexture
//meterial.wireframe = true
// meterial.transparent = true
// meterial.opacity = 0.5
// meterial.alphaMap = doorColorTexture
//meterial.side = THREE.DoubleSide

// 2 - MESH NORMAL - (used for lighting, reflection, etc)
// const meterial  = new THREE.MeshNormalMaterial()
// meterial.side = THREE.DoubleSide
// meterial.flatShading = true


// 3 - MESH MATCAP METERIAL - (not need light illustrate exact meterial even shadow and highlight)
// const meterial = new THREE.MeshMatcapMaterial()
// meterial.matcap = matcapMeterial

// 4 - MESH DEPTH METERIAL - (color the geometry white to if its close to the near, and black to the far)
// const meterial = new THREE.MeshDepthMaterial()

// 5 MESH LAMBERT METERIAL - (react to light surface become brighter no reflection)
//const meterial = new THREE.MeshLambertMaterial()

// 6 MESH PHONE METERIAL - (light refelection in the surface)
// const meterial = new THREE.MeshPhongMaterial({
//   color: "white",
//   shininess: 100,
//   specular: 0xffffff
// })

// 7 MESH TOON METERIAL - (cartoonist gradient cell-shaded effect)
// const meterial = new THREE.MeshToonMaterial()
// meterial.gradientMap = gradientTexture

// 8 - MESH STANDARD METERIAL - (more precise roughness and metelness in surface)
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.45
material.metalness = 0.65
material.map = doorColorTexture
material.aoMap = doorColorTexture
material.aoMapIntensity = 1

// find best meterial effect using DEBUG UI
gui.add(material, "metalness").min(0).max(1).step(0.01).name("Metelness")
gui.add(material, "roughness").min(0).max(1).step(0.01).name("Roughness")
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.01).name("Intensity")

const sphere = new THREE.Mesh(
   new THREE.SphereGeometry(0.5, 16, 16),
   material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1,1),
  material
)
plane.geometry.setAttribute("uv2", new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3,0.2,16,32),
  material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)

// LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 1
pointLight.position.y = 1
pointLight.position.z = 2
scene.add(pointLight)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
)

camera.position.z = 3
camera.lookAt(plane.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

const clock = new THREE.Clock()

const animation = () => {
  const elapsedTime = clock.getElapsedTime()

  sphere.rotation.x = 0.1 * elapsedTime
  plane.rotation.x = 0.1 * elapsedTime
  torus.rotation.x = 0.1 * elapsedTime

  sphere.rotation.y = 0.10 * elapsedTime
  plane.rotation.y = 0.10 * elapsedTime
  torus.rotation.y = 0.10 * elapsedTime

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}
animation()