import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const canvas = document.querySelector('canvas.sphere')

const gui = new GUI().close()

const ShaderVariables = {
 uWaveElevation: 0.3,
 uWaveFrequencyX: 3,
 uWaveFrequencyY: 1,
 uDepthColor: '#61ae74',
 uSurfaceColor: '#0b2310'
}

const Sphere = gui.addFolder('Sphere')

Sphere.add(ShaderVariables, 'uWaveElevation').min(0).max(1).step(0.001).name('Wave Elevation').onChange(() => {
 material.uniforms.uWaveElevation.value = ShaderVariables.uWaveElevation
})

Sphere.add(ShaderVariables, 'uWaveFrequencyX').min(0).max(10).step(0.001).name('Wave Frequency X').onChange(() => {
 material.uniforms.uWaveFrequency.value.x = ShaderVariables.uWaveFrequencyX
})

Sphere.add(ShaderVariables, 'uWaveFrequencyY').min(0).max(10).step(0.001).name('Wave Frequency Y').onChange(() => {
 material.uniforms.uWaveFrequency.value.y = ShaderVariables.uWaveFrequencyY
})

Sphere.addColor(ShaderVariables, 'uDepthColor').name('Depth Color').onChange(() => {
 material.uniforms.uDepthColor.value.set(ShaderVariables.uDepthColor)
})

Sphere.addColor(ShaderVariables, 'uSurfaceColor').name('Surface Color').onChange(() => {
 material.uniforms.uSurfaceColor.value.set(ShaderVariables.uSurfaceColor)
})



const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 2
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(0, 6, 0)
spotLight.angle = Math.PI / 4
spotLight.penumbra = 0.05
spotLight.decay = 0
spotLight.distance = 10
spotLight.intensity = 2
spotLight.angle = 0.7
spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false
scene.add(spotLightHelper)


const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.ShaderMaterial({
 vertexShader: vertexShader,
 fragmentShader: fragmentShader,
 uniforms: {
  uTime: { value: 0 },
  uWaveElevation: { value: ShaderVariables.uWaveElevation },
  uWaveFrequency: { value: new THREE.Vector2(ShaderVariables.uWaveFrequencyX, ShaderVariables.uWaveFrequencyY) },
  uDepthColor: { value: new THREE.Color(ShaderVariables.uDepthColor) },
  uSurfaceColor: { value: new THREE.Color(ShaderVariables.uSurfaceColor) },
 },
})

// material.wireframe = true
const sphere = new THREE.Mesh(geometry, material)
sphere.position.y = 1
sphere.castShadow = true
scene.add(sphere)

const planeGeometry = new THREE.PlaneGeometry(10, 10)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
plane.position.y = -1
plane.receiveShadow = true
scene.add(plane)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

camera.position.z = 5


const sizes = {
 width: window.innerWidth,
 height: window.innerHeight
}

window.addEventListener('resize', () => {
 // Update sizes
 sizes.width = window.innerWidth
 sizes.height = window.innerHeight

 // Update camera
 camera.aspect = sizes.width / sizes.height
 camera.updateProjectionMatrix()

 // Update renderer
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const renderer = new THREE.WebGLRenderer({
 canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
function animate() {

 const elapsedTime = clock.getElapsedTime()

 material.uniforms.uTime.value = elapsedTime
 requestAnimationFrame(animate)
 controls.update()

 renderer.render(scene, camera)
}

animate()