import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import GUI from 'lil-gui';

/**
 * Initialize the scene, camera, and renderer
 */
function init() {
	// Canvas
	const canvas = document.querySelector('canvas.webgl');

	// Scene
	const scene = new THREE.Scene();

	// Sizes
	const sizes = { width: window.innerWidth, height: window.innerHeight };

	// Lights
	const lights = setupLights(scene);

	// Objects
	const objects = createObjects(scene);

	// Camera
	const camera = createCamera(sizes);
	scene.add(camera);

	// Controls
	const controls = createControls(camera, canvas);

	// Renderer
	const renderer = createRenderer(canvas, sizes);

	// Debug GUI
	setupDebugUI(lights);

	// Event Listeners
	setupEventListeners(camera, renderer, sizes);

	// Start Animation Loop
	animate(renderer, scene, camera, controls, objects);
}

/**
 * Setup different lights in the scene
 */
function setupLights(scene) {
	const lights = {};

	// Ambient Light
	lights.ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(lights.ambientLight);

	// Directional Light
	lights.directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
	lights.directionalLight.position.set(1, 0.25, 0);
	scene.add(lights.directionalLight);

	// Hemisphere Light
	lights.hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
	scene.add(lights.hemisphereLight);

	// Point Light
	lights.pointLight = new THREE.PointLight(0xff9000, 1.5, 10, 2);
	lights.pointLight.position.set(1, -0.5, 1);
	scene.add(lights.pointLight);

	// RectArea Light
	lights.rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
	lights.rectAreaLight.position.set(-1.5, 0, 1.5);
	lights.rectAreaLight.lookAt(new THREE.Vector3());
	scene.add(lights.rectAreaLight);

	// Spot Light
	lights.spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1);
	lights.spotLight.position.set(0, 2, 3);
	lights.spotLight.target.position.x = -0.75;
	scene.add(lights.spotLight);
	scene.add(lights.spotLight.target);

	// Helpers
	scene.add(new THREE.HemisphereLightHelper(lights.hemisphereLight, 0.2));
	scene.add(new THREE.DirectionalLightHelper(lights.directionalLight, 0.2));
	scene.add(new THREE.PointLightHelper(lights.pointLight, 0.2));
	scene.add(new THREE.SpotLightHelper(lights.spotLight));
	scene.add(new RectAreaLightHelper(lights.rectAreaLight));

	return lights;
}

/**
 * Create objects with standard material
 */
function createObjects(scene) {
	const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });

	const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
	sphere.position.x = -1.5;

	const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

	const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
	torus.position.x = 1.5;

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
	plane.rotation.x = -Math.PI * 0.5;
	plane.position.y = -0.65;

	scene.add(sphere, cube, torus, plane);

	return { sphere, cube, torus };
}

/**
 * Create a camera
 */
function createCamera(sizes) {
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
	camera.position.set(1, 1, 2);
	return camera;
}

/**
 * Create OrbitControls
 */
function createControls(camera, canvas) {
	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	return controls;
}

/**
 * Create a WebGL renderer
 */
function createRenderer(canvas, sizes) {
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	return renderer;
}

/**
 * Setup Debug UI using Lil-GUI
 */
function setupDebugUI(lights) {
	const gui = new GUI();
	gui.add(lights.ambientLight, 'intensity', 0, 3, 0.001).name('Ambient Light Intensity');
	gui.add(lights.directionalLight, 'intensity', 0, 3, 0.001).name('Directional Light Intensity');
	gui.add(lights.pointLight, 'intensity', 0, 3, 0.001).name('Point Light Intensity');
	gui.add(lights.spotLight, 'intensity', 0, 3, 0.001).name('Spot Light Intensity');
	gui.add(lights.rectAreaLight, 'intensity', 0, 3, 0.001).name('RectArea Light Intensity');
}

/**
 * Setup event listeners (Resize)
 */
function setupEventListeners(camera, renderer, sizes) {
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		camera.aspect = sizes.width / sizes.height;
		camera.updateProjectionMatrix();

		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});
}

/**
 * Animation loop
 */
function animate(renderer, scene, camera, controls, objects) {
	const clock = new THREE.Clock();

	const tick = () => {
		const elapsedTime = clock.getElapsedTime();

		// Update object rotations
		objects.sphere.rotation.y = 0.1 * elapsedTime;
		objects.cube.rotation.y = 0.1 * elapsedTime;
		objects.torus.rotation.y = 0.1 * elapsedTime;

		objects.sphere.rotation.x = 0.15 * elapsedTime;
		objects.cube.rotation.x = 0.15 * elapsedTime;
		objects.torus.rotation.x = 0.15 * elapsedTime;

		// Update controls
		controls.update();

		// Render
		renderer.render(scene, camera);

		// Call tick again on the next frame
		requestAnimationFrame(tick);
	};

	tick();
}

// Initialize the scene
init();
