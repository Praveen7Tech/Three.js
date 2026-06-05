import * as THREE from "three"

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

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas.webgl")
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
