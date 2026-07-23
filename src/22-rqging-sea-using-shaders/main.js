import "./style.css";
import * as THREE from "three";
// GLSL Shaders
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from "dat.gui"

/**
 * DEBUG UI
 */
const gui = new dat.GUI({width: 340});
const debugObject ={
    depthColor:"#186691",
    surfaceColor:"#9bd8ff"
}

const canvas = document.querySelector('canvas.webgl');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1,1,1);
scene.add(camera);

const geometry = new THREE.PlaneGeometry(2,2,120,120)

const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    vertexShader:waterVertexShader,
    fragmentShader:waterFragmentShader,
    uniforms:{
        uTime: {value: 0},

        uBigWavesElavation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(4, 1.5)},
        uBigWavesSpeed: {value: 0.75},

        uSmallWavesElavation : {value: 0.15},
        uSmallWavesFrequency: {value: 3},
        uSmallWavesSpeed: {value: 0.2},
        uSmallWavesIteration: {value: 4},
        
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 5}
    }
});

// DEBUG
gui.add(material.uniforms.uBigWavesElavation, 'value').min(0).max(1).step(0.001).name("uBigWavesElavation")
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name("uBigWavesFrequencyX")
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name("uBigWavesFrequencyY")
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name("uBigWavesSpeed")

gui.add(material.uniforms.uSmallWavesElavation, 'value').min(0).max(1).step(0.001).name("uSmallWavesElavation")
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name("uSmallWavesFrequency")
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name("uSmallWavesSpeed")
gui.add(material.uniforms.uSmallWavesIteration, 'value').min(0).max(8).step(1).name("uSmallWavesIteration")

gui.addColor(debugObject, "depthColor").onChange(()=> {
    material.uniforms.uDepthColor.value.set(debugObject.depthColor)
}).name("DepthColor")
gui.addColor(debugObject, "surfaceColor").onChange(()=>{
    material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
}).name("SurfaceColor")

gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name("uColorOffset")

gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name("uColorMultiplier")

const sea = new THREE.Mesh(
    geometry,
    material
);
sea.rotation.x = -Math.PI * 0.5;
sea.scale.y = 2/2
scene.add(sea);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping =true;

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true

});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const clock = new THREE.Clock()

function animation(){
    const elapsedTime = clock.getElapsedTime();
    // Update water
    material.uniforms.uTime.value = elapsedTime;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animation)
}

animation()