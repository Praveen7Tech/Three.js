import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const cursor = {
  x:0,
  y:0
}

window.addEventListener("mousemove",(event)=>{
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5)
})

const canvas = document.querySelector("canvas.webgl")

// creating a scene (place to render items or stage)
const scene = new THREE.Scene()

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1,5,5,5),
  new THREE.MeshBasicMaterial({color: "red"})
)

scene.add(mesh)

const sizes ={
  width: 800,
  height: 600
}
//1 - Perspective camera - (that have its owm perspective from each position)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//2 - Orthographic camera - (there is no persepective get afixed view for each position)
const OrthoCamera = new THREE.OrthographicCamera(-1,1,-1,1)

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// CONTROLLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // damping the controll flow
// controls.target.y = 1   // use to target the control initial view
// controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

// ANIMATIONS
const animation = ()=>{
  const elapsedTime = clock.getElapsedTime()

  // UPDATE OBJECT
  //mesh.rotation.y = elapsedTime

  // UPDATE CAMERA
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)

  // UPDATE CONTROLLS
  controls.update()  // add damping for each frame

  // Render
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}

animation()