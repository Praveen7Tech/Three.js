import "./style.css"
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

const scene = new THREE.Scene()

//const geometry =new THREE.BoxGeometry(1,1,1,2,2,2)

const geometry = new THREE.BufferGeometry()

const count = 500
let positionArray = new Float32Array(count * 3 * 3)

for(let i = 0 ; i < count * 3 * 3 ; i++){
  positionArray[i] = (Math.random()) * 4
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute("position", positionAttribute)

const meterial = new THREE.MeshBasicMaterial({
  color:"red",
  wireframe: true
})
const mesh = new THREE.Mesh(geometry, meterial)
scene.add(mesh)

const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
}

// RESIZE THE SCREEN SIZE
window.addEventListener("resize", ()=>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight

  // update the camera aspect ratio when screen resize
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer size also
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// FULL SCREEN WHEN DOUBLE CLICK
window.addEventListener("dblclick", ()=>{
  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }else{
    document.exitFullscreen()
  }
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

const OrthoCamera = new THREE.OrthographicCamera(-1,1,-1,1)

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// CONTROLLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true 

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// ANIMATIONS
const animation = ()=>{

  // UPDATE CONTROLLS
  controls.update() 

  // Render
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}

animation()