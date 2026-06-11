import "./style.css"
import * as THREE from "three"
import * as dat from "dat.gui"
import gsap from "gsap"
const gui = new dat.GUI()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

const textureloader = new THREE.TextureLoader();
const meshTexture = await textureloader.loadAsync('textures/toon/1.png');
meshTexture.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial({
    color: "#ff7600",
    gradientMap: meshTexture
})

const objectDistance = 5
const torus =  new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4,16,100),
    material
)

const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)

torus.position.set(2, 0, 0)
cone.position.set(-2, -objectDistance, 0)
torusKnot.position.set(2, -objectDistance * 2, 0)

scene.add(torus, cone, torusKnot)

const sectionMeshes = [torus, cone, torusKnot]

/* PARTICLES */
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0 ; i < particlesCount ; i++){
    positions[i*3] = (Math.random() - 0.5) * 10
    positions[i*3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
    positions[i*3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
const particleMaterial = new THREE.PointsMaterial({
    color: "#ff7600",
    sizeAttenuation: true,
    size: 0.03
})
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

/* LIGHT */

const directionLight = new THREE.DirectionalLight("#ffffff", 1)
directionLight.position.set(2,2,0)
scene.add(directionLight)

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
camera.position.z = 7
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({ 
    canvas ,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2))

/* SCROLL ANIMATE */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", ()=>{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if(newSection !== currentSection){
        currentSection = newSection;

        gsap.to(sectionMeshes[currentSection].rotation,{
            duration: 1.5,
            ease: "power2.inOut",
            x: "+=6",
            y: "+=3"
        })
    }
})

let cursor = {
    x : 0,
    y : 0
}

window.addEventListener("mousemove",(event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
     const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

     /*objects rotations */
    for(let mesh of sectionMeshes){
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    /*Camera scroll animation */
    camera.position.y = -scrollY / sizes.height * objectDistance
    const parallaxX = cursor.x - 0.5
    const parallaxY = -(cursor.y - 0.5)

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.05

    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.05

    renderer.render(scene,camera)
    requestAnimationFrame(tick)
}

tick()