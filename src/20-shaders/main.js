import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// GLSL Shaders
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

// Debug UI
import * as dat from "dat.gui";
const gui = new dat.GUI();

/* -------------------------------------------------------
 * Canvas
 * -----------------------------------------------------*/
const canvas = document.querySelector(".webgl");

/* -------------------------------------------------------
 * Scene
 * -----------------------------------------------------*/
const scene = new THREE.Scene();

/* -------------------------------------------------------
 * Sizes
 * -----------------------------------------------------*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

/* -------------------------------------------------------
 * Camera
 * -----------------------------------------------------*/
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.set(0, 0, 3);
scene.add(camera);

/* -------------------------------------------------------
 * Texture
 *
 * This texture will be passed to the fragment shader
 * through a uniform.
 * -----------------------------------------------------*/
const textureLoader = new THREE.TextureLoader();

const flagTexture = await textureLoader.loadAsync(
    "textures/flag/indianFlag.avif"
);

/* -------------------------------------------------------
 * Geometry
 *
 * High subdivisions are required because the vertex
 * shader can only move existing vertices.
 * -----------------------------------------------------*/
const geometry = new THREE.PlaneGeometry(
    2,
    2,
    32,
    32
);

/* -------------------------------------------------------
 * Custom Attribute
 *
 * Creates one random value for every vertex.
 * This demonstrates how to send custom data from
 * JavaScript to the vertex shader.
 * -----------------------------------------------------*/
const count = geometry.attributes.position.count;

const random = new Float32Array(count);

for (let i = 0; i < count; i++) {
    random[i] = Math.random();
}

geometry.setAttribute(
    "aRandom",
    new THREE.BufferAttribute(random, 1)
);

/* -------------------------------------------------------
 * Shader Material
 *
 * Uniforms
 * - Shared values between JS and shaders
 * - Same value for every vertex
 *
 * Attributes
 * - Data unique to every vertex
 *
 * Varyings
 * - Used to pass data from Vertex Shader
 *   to Fragment Shader
 * -----------------------------------------------------*/
const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,

    vertexShader: testVertexShader,

    fragmentShader: testFragmentShader,

    uniforms: {
        // Wave frequency
        uFrequency: {
            value: new THREE.Vector2(10, 5),
        },

        // Animation time
        uTime: {
            value: 0,
        },

        // Solid color (currently unused)
        uColor: {
            value: new THREE.Color("orange"),
        },

        // Texture passed to fragment shader
        uTexture: {
            value: flagTexture,
        },
    },
});

/* -------------------------------------------------------
 * Debug Controls
 * -----------------------------------------------------*/
gui.add(material.uniforms.uFrequency.value, "x")
    .min(0)
    .max(20)
    .step(0.01)
    .name("Frequency X");

gui.add(material.uniforms.uFrequency.value, "y")
    .min(0)
    .max(20)
    .step(0.01)
    .name("Frequency Y");

/* -------------------------------------------------------
 * Mesh
 * -----------------------------------------------------*/
const plane = new THREE.Mesh(
    geometry,
    material
);

plane.scale.y = 2 / 3;

scene.add(plane);

/* -------------------------------------------------------
 * Orbit Controls
 * -----------------------------------------------------*/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* -------------------------------------------------------
 * Renderer
 * -----------------------------------------------------*/
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

/* -------------------------------------------------------
 * Resize
 * -----------------------------------------------------*/
window.addEventListener("resize", () => {

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect =
        sizes.width / sizes.height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        sizes.width,
        sizes.height
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});

/* -------------------------------------------------------
 * Clock
 * -----------------------------------------------------*/
const clock = new THREE.Clock();

/* -------------------------------------------------------
 * Animation
 * -----------------------------------------------------*/
function animate() {

    const elapsedTime =
        clock.getElapsedTime();

    // Update shader animation
    material.uniforms.uTime.value =
        elapsedTime;

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();