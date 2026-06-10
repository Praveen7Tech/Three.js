import { OrbitControls } from "three/examples/jsm/Addons.js"
import "./style.css"
import * as THREE from "three"
import * as dat from "dat.gui"
const gui = new dat.GUI()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

/*MOUSE MOVE */
const mouse = new THREE.Vector2()

window.addEventListener("mousemove",(event)=>{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})


const camere = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camere.position.z = 4
scene.add(camere)

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
sphere1.position.x = - 1.8
const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
sphere3.position.x = 1.8
scene.add(sphere1,sphere2,sphere3)

/* RAYCASTER */
const raycaster = new THREE.Raycaster()
let currentIntersect =null

window.addEventListener("click",()=>{
    if(currentIntersect){
        if(currentIntersect.object == sphere1){
            console.log("clicked shere 1")
        }else if(currentIntersect.object == sphere2){
            console.log("clicked shere 2")   
        }else if(currentIntersect.object == sphere3){
            console.log("clicked shere 3")   
        }
    }
})


const controls = new OrbitControls(camere, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
const animate = () => {
    const elapedTime = clock.getElapsedTime()

    sphere1.position.y = Math.sin(elapedTime * 0.3) * 1.5
    sphere2.position.y = Math.sin(elapedTime * 0.8) * 1.5
    sphere3.position.y = Math.sin(elapedTime * 1.4) * 1.5

    // CAST A RAY (using fixed position)
//     const rayOrigin = new THREE.Vector3(-3,0,0)
//     const rayDirection = new THREE.Vector3(1, 0,0)
//     rayDirection.normalize()
//    raycaster.set(rayOrigin, rayDirection)

    // CAST RAY USING MOUSE MOVE (hover)
    raycaster.setFromCamera(mouse, camere)

   const objectsToTest = [sphere1, sphere2,sphere3]
   const intersects = raycaster.intersectObjects(objectsToTest)
   
   for(let obj of objectsToTest){
     obj.material.color.set(0xff0000)
   }

   for(let intersect of intersects){
    intersect.object.material.color.set(0x0000ff)
   }

   if(intersects.length){
        if(!currentIntersect){
            console.log("mouse entered")
        }
        currentIntersect = intersects[0]
   }else{
        if(currentIntersect){
            console.log("mouse leave")
        }
        currentIntersect = null
   }

    controls.update()
    renderer.render(scene, camere)
    requestAnimationFrame(animate)
}

animate()