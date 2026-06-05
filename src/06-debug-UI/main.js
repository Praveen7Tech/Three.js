import "./style.css"
import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

/**
 * DEBUG UI
 */
const gui = new dat.GUI()
const parameters = {
  color: "#ff0000",
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 1,
      y: mesh.rotation.y + Math.PI * 2
    })
  }
}
gui.hide()


const cursor = {
  x: 0,
  y: 0
}

/**
 * CANVAS
 */
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

/**
 * OBJECTS
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const meterial = new THREE.MeshBasicMaterial({color: "red"})
const mesh = new THREE.Mesh(geometry, meterial)
scene.add(mesh)
/**
 * DEBUG CONTROLS
 */
gui.addColor(parameters, "color")
  .onChange(() => {
    meterial.color.set(parameters.color)
  })

gui.add(mesh.position, "x")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elevation x")

gui.add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("elevation y")

gui.add(mesh, "visible")
gui.add(meterial, "wireframe")
gui.add(parameters, "spin")

/**
 * SIZES
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * CAMERA
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
)

camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * CONTROLS
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)

/**
 * ANIMATION
 */
const animation = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}
animation()