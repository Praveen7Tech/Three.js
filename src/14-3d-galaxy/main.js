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

/** GALAXY */
const parameters = {
    count: 10000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984"
}

let geometry, material, particles = null
const generateGalaxy = () => {

    if(particles !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {

        const i3 = i * 3

        // Positions
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI *2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY =  Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ =  Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
       
        positions[i3 ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Colors
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3 ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
}

generateGalaxy()

gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, "size").min(0.001).max(0.10).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, "radius").min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, "branches").min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, "spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, "randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, "randomnessPower").min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy)
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy)


////////////////////////////

const camere = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camere.position.z = 4
scene.add(camere)

const controls = new OrbitControls(camere, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const animate = () => {
    const elapedTime = clock.getElapsedTime()

    controls.update()
    renderer.render(scene, camere)
    requestAnimationFrame(animate)
}

animate()