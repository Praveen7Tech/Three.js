import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { gsap } from 'gsap'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const loader = document.querySelector('.loader')
const loaderBar = document.querySelector('.loader-bar')
const loaderPercent = document.querySelector('.loader-percent')
const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const overlayGeometry = new THREE.PlaneGeometry(2, 2)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uAlfa: { value: 1 }
    },
    vertexShader: `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlfa;

        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlfa);
        }
    `
})

const overlay = new THREE.Mesh(
    overlayGeometry,
    overlayMaterial
)

scene.add(overlay)

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)

camera.position.set(4, 2, 5)
camera.lookAt(0, 1, 0)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target.set(0, 1, 0)
controls.minDistance = 2
controls.maxDistance = 10

const loadingManager = new THREE.LoadingManager()

let screenReady = false;
loadingManager.onLoad = () => {

    // add 0.5 seconds delay that avoid the jumping to the scene
    gsap.delayedCall(0.5, ()=>{
        gsap.to(loader, {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                loader.classList.add('hidden')
            }
        })

        gsap.to(overlayMaterial.uniforms.uAlfa, {
            duration: 2,
            value: 0,
            ease: 'power2.out',
            onComplete:()=>{
                screenReady = true
            }
        })
    })

    console.log('All loaded')
}

loadingManager.onProgress = (url, loaded, total) => {
    const progress = loaded / total
    const percent = Math.round(progress * 100)

    loaderBar.style.width = `${percent}%`
    loaderPercent.textContent = `${percent}%`
}

loadingManager.onError = (url) => {
    console.error('Loading error:', url)
}

const gltfLoader = new GLTFLoader(loadingManager)
const exrLoader = new EXRLoader(loadingManager)

const loadEnvironmentMap = async () => {
    const environmentMap = await exrLoader.loadAsync(
        '/textures/environmentMaps/walkWay/venetian_crossroads_2k.exr'
    )

    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap

    return environmentMap
}

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (!child.isMesh) return

        child.material.envMapIntensity = 1
        child.material.needsUpdate = true
    })
}

const loadHelmet = async () => {
    const gltf = await gltfLoader.loadAsync(
        '/models/DamagedHelmet/glTF/DamagedHelmet.gltf'
    )

    const helmet = gltf.scene

    helmet.scale.setScalar(2)

    scene.add(helmet)

    controls.target.set(0, 0, 0)

    updateAllMaterials()

    return helmet
}

/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [
    {
        position: new THREE.Vector3(1.2, 0.8, -2),
        element: document.querySelector('.point-0')
    }
]

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const animate = () => {
    controls.update()

    if(screenReady){
        // Filter out the overlay mesh so it doesn't block raycasts
    const objectsToTest = scene.children.filter(child => child !== overlay)

    for (const point of points) {
        // Clone and project 3D point to 2D NDC space (-1 to +1)
        const screenPosition = point.position.clone()
        screenPosition.project(camera)

        // Pass Vector2 (x, y) to setFromCamera
        raycaster.setFromCamera(
            new THREE.Vector2(screenPosition.x, screenPosition.y), 
            camera
        )
        
        const intersects = raycaster.intersectObjects(objectsToTest, true)

        if (intersects.length === 0) {
            point.element.classList.add('visible')
        } else {
            const intersectionDistance = intersects[0].distance
            const pointDistance = point.position.distanceTo(camera.position)

            // Hide element if an object is closer to the camera than the point itself
            if (intersectionDistance < pointDistance - 0.05) {
                point.element.classList.remove('visible')
            } else {
                point.element.classList.add('visible')
            }
        }

        // Convert NDC to pixel coordinates
        const translateX = screenPosition.x * sizes.width * 0.5
        const translateY = -screenPosition.y * sizes.height * 0.5
        point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

const init = async () => {
    try {
        await Promise.all([
            loadEnvironmentMap(),
            loadHelmet()
        ])

        console.log('Scene ready')
    } catch (error) {
        console.error('Loading error:', error)
    }
}

animate()
init()