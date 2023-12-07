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
 uDepthColor: '#00a3d7',
 uSurfaceColor: '#ffffff',
 uWaveDirection: 4,
 wireframe: false
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

Sphere.add(ShaderVariables, 'uWaveDirection').min(-4).max(4).step(0.001).name('Wave Direction').onChange(() => {
 material.uniforms.uWaveDirection.value = ShaderVariables.uWaveDirection
})

Sphere.add(ShaderVariables, 'wireframe').name('Wireframe').onChange(() => {
 material.wireframe = ShaderVariables.wireframe
})


const LightVariables = {
 lightX: 1,
 lightY: 3,
 lightZ: 1,
 shadowLeft: -70,
 shadowRight: 70,
 shadowTop: 70,
 shadowBottom: -70,
 shadowMapWidth: 1024,
 shadowMapHeight: 1024
}

const DirectionLight = gui.addFolder('Direction Light')

DirectionLight.add(LightVariables, 'lightX').min(-10).max(10).step(0.001).name('Light X').onChange(() => {
 light.position.x = LightVariables.lightX
})
DirectionLight.add(LightVariables, 'lightY').min(-10).max(10).step(0.001).name('Light Y').onChange(() => {
 light.position.y = LightVariables.lightY
})
DirectionLight.add(LightVariables, 'lightZ').min(-10).max(10).step(0.001).name('Light Z').onChange(() => {
 light.position.z = LightVariables.lightZ
})

DirectionLight.add(LightVariables, 'shadowMapWidth').min(0).max(4096).step(0.001).name('Shadow Map Width').onChange(() => {
 light.shadow.mapSize.width = LightVariables.shadowMapWidth
})

DirectionLight.add(LightVariables, 'shadowMapHeight').min(0).max(4096).step(0.001).name('Shadow Map Height').onChange(() => {
 light.shadow.mapSize.height = LightVariables.shadowMapHeight
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 2
scene.add(ambientLight)

const light = new THREE.DirectionalLight(0xdfebff, 1);
light.position.set(1, 3, 1);

light.castShadow = true;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

const lightPosition = 90
light.shadow.camera.left = -lightPosition;
light.shadow.camera.right = lightPosition;
light.shadow.camera.top = lightPosition;
light.shadow.camera.bottom = -lightPosition;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.camera.zoom = 1;
light.shadow.bias = 0.0001

scene.add(light);



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
  uWaveDirection: { value: 4 }
 },
})

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
camera.position.y = 4
camera.position.x = 4


const sizes = {
 width: window.innerWidth,
 height: window.innerHeight
}

window.addEventListener('resize', () => {
 sizes.width = window.innerWidth
 sizes.height = window.innerHeight

 camera.aspect = sizes.width / sizes.height
 camera.updateProjectionMatrix()

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

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
 mouse.x = event.clientX / sizes.width * 2 - 1
 mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

const raycaster = new THREE.Raycaster()

function animate() {
 raycaster.setFromCamera(mouse, camera)

 const intersects = raycaster.intersectObject(sphere);
 if (intersects.length > 0) {
  material.uniforms.uWaveElevation.value = 0.5
  material.uniforms.uDepthColor.value.set('#ffaa00')
  material.uniforms.uSurfaceColor.value.set('#aa2222')
  material.uniforms.uWaveDirection.value = -4
 } else {
  material.uniforms.uWaveElevation.value = ShaderVariables.uWaveElevation
  material.uniforms.uDepthColor.value.set(ShaderVariables.uDepthColor)
  material.uniforms.uSurfaceColor.value.set(ShaderVariables.uSurfaceColor)
  material.uniforms.uWaveDirection.value = ShaderVariables.uWaveDirection
 }

 const elapsedTime = clock.getElapsedTime()

 material.uniforms.uTime.value = elapsedTime
 requestAnimationFrame(animate)
 controls.update()

 renderer.render(scene, camera)
}

animate()