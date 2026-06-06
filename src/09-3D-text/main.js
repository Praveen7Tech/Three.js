import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

// font loader
const loader = new FontLoader();
const font = await loader.loadAsync('fonts/helvetiker_regular.typeface.json');
// texture loader
const textureloader = new THREE.TextureLoader();
const fontTexture = await textureloader.loadAsync('textures/text-matcap.png');

const textGeometry = new TextGeometry("Hello Three.Js", {
  font,
  size: 0.5,
  depth: 0.2,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelSegments: 5
})

textGeometry.center()
const meterial = new THREE.MeshMatcapMaterial({ matcap: fontTexture })
//textMeterial.wireframe = true

const text = new THREE.Mesh(
  textGeometry,
  meterial
)
scene.add(text)

///////////////////////

const geometries = [
  new THREE.TorusGeometry(0.3, 0.2, 20, 45),
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.SphereGeometry(0.3, 16, 16),
  new THREE.ConeGeometry(0.3, 0.6, 16),
  new THREE.OctahedronGeometry(0.3)
]

for(let i = 0 ; i < 250 ; i++){
  const geometry = geometries[Math.floor(Math.random() * geometries.length)]
  const donut = new THREE.Mesh(geometry, meterial)

  donut.position.x = (Math.random() - 0.5) * 10
  donut.position.y = (Math.random() - 0.5) * 10
  donut.position.z = (Math.random() - 0.5) * 10

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const scale = Math.random()
  donut.scale.set(scale,scale,scale)

  scene.add(donut)
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const animation = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animation)
}
animation()

