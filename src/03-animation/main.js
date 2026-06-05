import * as THREE from "three"
import gsap from "gsap"

const canvas = document.querySelector("canvas.webgl")

// creating a scene (place to render items or stage)
const scene = new THREE.Scene()

// Objects to create the structure with geometry and meterial(paint)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const meterial = new THREE.MeshBasicMaterial({color: "red"})
const mesh = new THREE.Mesh(geometry, meterial)
scene.add(mesh)

const sizes ={
  width: 800,
  height: 600
}


// camera that give a view angle of the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 3
//scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
//renderer.render(scene, camera)

// GSAP - updation
gsap.to(mesh.position, {
  duration: 1,
  delay:1,
  x: 1
})
gsap.to(mesh.position, {
  duration: 1,
  delay:1,
  x: -1
})

// ANIMATIONS
const animation = ()=>{
  // updation
  //mesh.rotation.x -= 0.01

  // Render
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}

animation()