import * as THREE from "three"

// creating a scene (place to render items or stage)
const scene = new THREE.Scene()

// Objects to create the structure with geometry and meterial(paint)
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const meterial = new THREE.MeshBasicMaterial({color: "red"})
// const mesh = new THREE.Mesh(geometry, meterial)
// scene.add(mesh)

//1 - POSITION (POSITIONING OBJECT)
// mesh.position.x = 0.7
// mesh.position.y = -0.6
// mesh.position.z = 1
// mesh.position.set(0.7, -0.6, 1) // use set to position the vector at one

//2 - SCALE
// mesh.scale.x = 0.5
// mesh.scale.y = 0.8
// mesh.scale.z = 1
// mesh.scale.set(2, 0.5, 0.5)

// //3 - ROTATION
// mesh.rotation.reorder("YXZ") // if use multiple position change makea order first to behave like this order
// mesh.rotation.x = 2
// mesh.rotation.y = 1

// //4 - QUARD...

/////////////////////////////////////////////

// GROUP - (grouping entire or multiple object as one and change the positioning)

const group = new THREE.Group()
scene.add(group)
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({color: "red"})
)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:"green"})
)
cube1.position.x = -2

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:"blue"})
)
cube3.position.x = 2


group.add(cube1, cube2, cube3)


/////////////////////////////////////////////


//Axes Helper to position
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const sizes ={
  width: 800,
  height: 600
}


// camera that give a view angle of the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3
//scene.add(camera)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl")
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
