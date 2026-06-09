import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const sizes = {
  width: window.innerWidth, 
  height: window.innerHeight
}

// TEXTURE
const loader = new THREE.TextureLoader();
const doorColorTexture = await loader.loadAsync( 'textures/door/color.png' );
const doorAlphaTexture = await loader.loadAsync( 'textures/door/alpha.png' );
const doorAmbientOculsionTexture = await loader.loadAsync( 'textures/door/ambient_oclusion.png' );
const doorHeightTexture = await loader.loadAsync( 'textures/door/height.png' );
const doorNormalTexture = await loader.loadAsync( 'textures/door/normal.png' );
const doorMetelnessTexture = await loader.loadAsync( 'textures/door/metelness.png' );
const doorRoughnessTexture = await loader.loadAsync( 'textures/door/roughness.png' );

const wallColorTexture = await loader.loadAsync( 'textures/wall/color.png' );
const wallAmbientOculsionTexture = await loader.loadAsync( 'textures/wall/ambient_occulsion.png' );
const wallNormalTexture = await loader.loadAsync( 'textures/wall/normal.png' );
const wallRoughnessTexture = await loader.loadAsync( 'textures/wall/roughness.png' );

const grassColorTexture = await loader.loadAsync( 'textures/grass/color.png' );
const grassAmbientOculsionTexture = await loader.loadAsync( 'textures/grass/ambient_occulsion.png' );
const grassNormalTexture = await loader.loadAsync( 'textures/grass/normal.png' );
const grassRoughnessTexture = await loader.loadAsync( 'textures/grass/roughness.png' );

grassColorTexture.repeat.set(8,8)
grassAmbientOculsionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOculsionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOculsionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// FOG
const fog = new THREE.Fog("#262837",1.5, 18)
scene.fog = fog

// HOUSE GROUP

const house = new THREE.Group()
scene.add(house)

// WALLS
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallAmbientOculsionTexture,
        normalMap: wallNormalTexture,
        roughness: wallRoughnessTexture
    })
)
//walls.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))

walls.position.y = 2.5 /2
house.add(walls)

// ROOF
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({color:"#b35f45" })
)
roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5
house.add(roof)

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOculsionTexture,
        normalMap: grassNormalTexture,
        roughness: grassRoughnessTexture
    })
)
//floor.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
house.add(floor)

// DOOR
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1,2,100,100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        // transparent: true,
        // alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOculsionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        //metalness: doorMetelnessTexture,
        roughness: doorRoughnessTexture
    })
)
//door.geometry.setAttribute("uv2", new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))

door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

// BUSH
const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color: "#89c854"})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.2,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

house.add(bush1,bush2,bush3,bush4)

// GRAVES
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.4,0.6,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color:"#b2b6b1"})

for(let i = 0 ; i < 50 ; i++){
    const angle = Math.random() * Math.PI * 2

    // Ring around house
    const radius = 4 + Math.random() * 5

    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)

    grave.position.set(x, 0.2, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    grave.castShadow = true;
    graves.add(grave)
}

// LIGHTS ///////////

//Ambient Light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12)
scene.add(ambientLight)

// Moon Light
const moonLight = new THREE.DirectionalLight(0xffffff, 0.12)
moonLight.position.set(4, 5, -2)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight("#ff7d46",2, 10)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

// ghost Lights
const ghost1 = new THREE.PointLight("#ff00ff", 3, 8)
const ghost2 = new THREE.PointLight("#00ffff", 3, 8)
scene.add(ghost1, ghost2)

///////////////////

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(2, 4, 10)
camera.lookAt(0, 0, 0)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor("#262835")

// SHADOWS & OPTIMISE SHADOW
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 512
moonLight.shadow.mapSize.height = 512
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 20

moonLight.shadow.camera.top = 10
moonLight.shadow.camera.right = 10
moonLight.shadow.camera.bottom = -10
moonLight.shadow.camera.left = -10

doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.castShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.castShadow = true
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

walls.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

bush1.receiveShadow = true
bush2.receiveShadow = true
bush3.receiveShadow = true
bush4.receiveShadow = true

floor.receiveShadow = true


const clock = new THREE.Clock()

const animate = () =>{
    // ghost light update
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.sin(ghost1Angle) * 4
    ghost1.position.z = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.sin(ghost2Angle) * 5
    ghost2.position.z = Math.cos(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5)


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()