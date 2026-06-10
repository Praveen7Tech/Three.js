import { OrbitControls } from "three/examples/jsm/Addons.js"
import "./style.css"
import * as THREE from "three"

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()


const loader = new THREE.TextureLoader()
const particleTexture = await loader.loadAsync('textures/particles/star3.png')
// console.log(particleTexture)

// PARTICLES

// BUFFER GEOMETRY
const particleGeometry = new THREE.BufferGeometry();
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i =0 ; i < count ; i++){
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] =  Math.random()
}

particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

const particleMeterial = new THREE.PointsMaterial()
particleMeterial.size = 0.15
//particleMeterial.color = new THREE.Color("red")
particleMeterial.sizeAttenuation = true
particleMeterial.transparent = true
particleMeterial.alphaMap = particleTexture
//particleMeterial.alphaTest = 0.001
//particleMeterial.depthTest = false
particleMeterial.depthWrite = false
particleMeterial.blending = THREE.AdditiveBlending
particleMeterial.vertexColors = true


const particles = new THREE.Points(particleGeometry, particleMeterial)
scene.add(particles)

const camere = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camere.position.z = 4
scene.add(camere)

const controls = new OrbitControls(camere, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const animate = () =>{
    const elapedTime = clock.getElapsedTime()
    //particles.position.y = -elapedTime
    for(let i = 0 ; i < count ; i++){
        const i3 = i * 3
        const x = particleGeometry.attributes.position.array[i3] 

        particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapedTime + x) 
    }
    //particleGeometry.attributes.position.needsUpdate = true

    controls.update()
    renderer.render(scene, camere)
    requestAnimationFrame(animate)
}

animate()