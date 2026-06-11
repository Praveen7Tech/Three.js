import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import * as CANNON from "cannon-es"

const gui = new dat.GUI()
const debugObject ={}

debugObject.createSphere = ()=>{
    createSphere(
        Math.random() * 0.5, 
        {
            x: (Math.random() - 0.5) * 3,
            y:3,
            z: (Math.random() - 0.5) * 3
        })
}
debugObject.createBox = ()=>{
    createBox(
        Math.random() ,
        Math.random(),
        Math.random(), 
        {
            x: (Math.random() - 0.5) * 3,
            y:3,
            z: (Math.random() - 0.5) * 3
        })
}
debugObject.reset = ()=>{
    for(let obj of objectToUpdate){
        obj.body.removeEventListener("collide",playHitSound)
        world.removeBody(obj.body)

        scene.remove(obj.mesh)
    }
}

gui.add(debugObject, "createSphere")
gui.add(debugObject, "createBox")
gui.add(debugObject, "reset")

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/** Sound */
const hitSound = new Audio('/sounds/tap.mp3')
const playHitSound = (collision)=>{
    const impactSound = collision.contact.getImpactVelocityAlongNormal()
    if(impactSound > 1.5){
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/* Physics */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)   //SAP reduces unnecessary collision checks
world.allowSleep = true                              //Sleeping skips bodies that have stopped moving
world.gravity.set(0, -9.82, 0)

// Material physical behaviour
const defaultMaterial = new CANNON.Material("concrete")

// Meterial used when two meterial colide - behaviour
const defaultContactMeterial = new CANNON.ContactMaterial(
    defaultMaterial, 
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7  // bounce back
    }
)

world.addContactMaterial(defaultContactMeterial)
world.defaultContactMaterial = defaultContactMeterial

// Spere
// const sphereShap = new CANNON.Sphere(1)
// const sphereBody = new CANNON.Body({
//     mass:1,
//     position: new CANNON.Vec3(0, 4, 0),
//     shape: sphereShap,
      //material: defaultMaterial
// })

 // Applying force to the object
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0  ))
// world.addBody(sphereBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
//floorBody.material = defaultMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

world.addBody(floorBody)

////////////////////////////

// Sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({
//         color: "#ff7600"
//     })
// )

// sphere.position.y = 1
// sphere.castShadow = true

// scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: "#444444"
    })
)

floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true

scene.add(floor)

// Directional Light
const directionalLight = new THREE.DirectionalLight("#ffffff", 3)

directionalLight.position.set(3, 5, 2)

directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.right = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5

scene.add(directionalLight)

// Optional shadow camera helper
//const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(helper)

// Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height, 0.1, 100)

camera.position.set(4, 4, 6)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera,canvas)

controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(
    sizes.width,
    sizes.height
)

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Resize
window.addEventListener("resize", () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect =
        sizes.width / sizes.height

    camera.updateProjectionMatrix()

    renderer.setSize(
        sizes.width,
        sizes.height
    )

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})

/** Creating multiple sphere using function */

const objectToUpdate = []

/** Sphere  */
const shepreGeometry = new THREE.SphereGeometry(1, 20, 20)
const shepreMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            color: "#ff7600"
        })

const createSphere = (radius, position)=>{

    const mesh = new THREE.Mesh( shepreGeometry, shepreMaterial)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Canon js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener("collide",playHitSound)
    world.addBody(body)

    //save in objcet to update
    objectToUpdate.push({
        mesh:mesh,
        body:body
    })
}

createSphere(0.5, {x: 0, y:3, z:0})

/** BOX */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            color: "#ff7600"
        })

const createBox = (width, height, depth, position)=>{

    const mesh = new THREE.Mesh( boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Canon js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener("collide",playHitSound)
    world.addBody(body)

    //save in objcet to update
    objectToUpdate.push({
        mesh:mesh,
        body:body
    })
}

//createBox(0.5, {x: 0, y:3, z:0})

// Animation

const clock = new THREE.Clock()
let oldElapseTime = 0

const tick = () =>{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapseTime
    oldElapseTime = elapsedTime

    // Constant force applying on the sphere like (wind)
    //sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // Update Physics world
    world.step(1/60, deltaTime, 3)

    for(let obj of objectToUpdate){
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    }

    // update the physics from physics world to sphere
    //sphere.position.copy(sphereBody.position)

    controls.update()

    renderer.render(
        scene,
        camera
    )

    requestAnimationFrame(tick)
}

tick()