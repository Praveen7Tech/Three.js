import "./style.css"
import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

const cursor = {
  x: 0,
  y: 0
}

const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => console.log("All loaded")
loadingManager.onProgress=()=> console.log("on Progress")
loadingManager.onError=(err)=> console.log("error",err)

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load("/door.jpg")

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI / 4
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

colorTexture.generateMipmaps = false  // while using (minFilter = THREE.NearestFilter) not need Mipmaping
colorTexture.minFilter = THREE.NearestFilter  // get nearest pixel clarity 
colorTexture.magFilter = THREE.NearestFilter // get exact better pixel quality with no blur

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const meterial = new THREE.MeshBasicMaterial({map: colorTexture})
const mesh = new THREE.Mesh(geometry, meterial)
scene.add(mesh)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height
)

camera.position.z = 3
camera.lookAt(mesh.position)
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

const animation = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animation)
}
animation()