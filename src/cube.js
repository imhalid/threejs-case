import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'

const canvas = document.querySelector('canvas.cube')

const CubeControls = {
 color: 0xaaffa0,
 scale: 1,
 rotationSpeedX: 0.01,
 rotationSpeedY: 0.05,
 scaleSpeed: 0.005,
}

const SpotLight = {
 Color: 0xffffff,
 Intensity: 2,
 Angle: 0.7,
 Decay: 0,
 Distance: 10,
 Helper: false,
}

const gui = new GUI().close()

const Cube = gui.addFolder('Cube')
Cube.addColor(CubeControls, 'color').onChange((color) => {
 cube.material.color.set(color)
})
Cube.add(CubeControls, 'scale', 0, 2).onChange((scale) => {
 cube.scale.set(scale, scale, scale)
})
Cube.add(CubeControls, 'rotationSpeedX', 0, 0.1)
Cube.add(CubeControls, 'rotationSpeedY', 0, 0.1)
Cube.add(CubeControls, 'scaleSpeed', 0, 0.1)

const Light = gui.addFolder('Spot Light')
Light.addColor(SpotLight, 'Color').onChange((color) => {
 spotLight.color.set(color)
})
Light.add(SpotLight, 'Intensity', 0, 10).onChange((intensity) => {
 spotLight.intensity = intensity
})
Light.add(SpotLight, 'Angle', 0, Math.PI / 2).onChange((angle) => {
 spotLight.angle = angle
})
Light.add(SpotLight, 'Decay', 0, 2).onChange((decay) => {
 spotLight.decay = decay
})
Light.add(SpotLight, 'Distance', 0, 20).onChange((distance) => {
 spotLight.distance = distance
})
Light.add(SpotLight, 'Helper').onChange((helper) => {
 spotLightHelper.visible = helper
})



const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

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

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0xaaffa0 })
const cube = new THREE.Mesh(geometry, material)
cube.position.y = 1
cube.castShadow = true
scene.add(cube)

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

let cubeScaleToggle = true
function animate() {
 requestAnimationFrame(animate)

 cube.rotation.x += CubeControls.rotationSpeedX
 cube.rotation.y += CubeControls.rotationSpeedY

 if (cube.scale.x >= 1.5) {
  cubeScaleToggle = false
 } else if (cube.scale.x <= 0.5) {
  cubeScaleToggle = true
 }

 cube.position.x = Math.sin(Date.now() * 0.001) * 2
 cube.position.z = Math.cos(Date.now() * 0.001) * 2

 cube.position.y = cube.scale.x / 2

 if (cubeScaleToggle) {
  cube.scale.x += CubeControls.scaleSpeed
  cube.scale.y += CubeControls.scaleSpeed
  cube.scale.z += CubeControls.scaleSpeed
 } else {
  cube.scale.x -= CubeControls.scaleSpeed
  cube.scale.y -= CubeControls.scaleSpeed
  cube.scale.z -= CubeControls.scaleSpeed
 }
 controls.update()
 renderer.render(scene, camera)
}

animate()