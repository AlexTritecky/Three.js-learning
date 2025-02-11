import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

	// Load textures
	const textures = loadTextures();

	// Lights
	const lights = setupLights(scene);

	// Materials
	const material = createMaterial();

	// Objects
	const objects = createObjects(scene, material, textures.simpleShadow);

	// Camera
	const camera = createCamera(sizes);
	scene.add(camera);

	// Controls
	const controls = createControls(camera, canvas);

	// Renderer
	const renderer = createRenderer(canvas, sizes);

	// Debug GUI
	setupDebugUI(lights, material);

	// Event Listeners
	setupEventListeners(camera, renderer, sizes);

	// Start Animation Loop
	animate(renderer, scene, camera, controls, objects);
}

/**
 * Load textures using a texture loader
 */
function loadTextures() {
	const textureLoader = new THREE.TextureLoader();

	return {
		bakedShadow: textureLoader.load('/textures/bakedShadow.jpg'),
		simpleShadow: textureLoader.load('/textures/simpleShadow.jpg')
	};
}

/**
 * Setup different lights in the scene
 */
function setupLights(scene) {
	const lights = {};

	// Ambient Light
	lights.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
	scene.add(lights.ambientLight);

	// Directional Light
	lights.directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
	lights.directionalLight.castShadow = true;
	configureShadow(lights.directionalLight.shadow, 1024, 1024, 1, 6, 2);
	lights.directionalLight.position.set(2, 2, -1);
	scene.add(lights.directionalLight);

	// Spot Light
	lights.spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
	lights.spotLight.castShadow = true;
	configureShadow(lights.spotLight.shadow, 1024, 1024, 1, 6);
	lights.spotLight.position.set(0, 2, 2);
	scene.add(lights.spotLight);
	scene.add(lights.spotLight.target);

	// Point Light
	lights.pointLight = new THREE.PointLight(0xffffff, 2.7);
	lights.pointLight.castShadow = true;
	configureShadow(lights.pointLight.shadow, 1024, 1024, 0.1, 5);
	lights.pointLight.position.set(-1, 1, 0);
	scene.add(lights.pointLight);

	return lights;
}

/**
 * Configure shadow settings for lights
 */
function configureShadow(shadow, width, height, near, far, size = null) {
	shadow.mapSize.width = width;
	shadow.mapSize.height = height;
	shadow.camera.near = near;
	shadow.camera.far = far;
	if (size !== null) {
		shadow.camera.top = size;
		shadow.camera.right = size;
		shadow.camera.bottom = -size;
		shadow.camera.left = -size;
	}
}

/**
 * Create a standard material
 */
function createMaterial() {
	return new THREE.MeshStandardMaterial({ roughness: 0.7 });
}

/**
 * Create objects with shadow properties
 */
function createObjects(scene, material, shadowTexture) {
	const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
	sphere.castShadow = true;

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
	plane.receiveShadow = true;
	plane.rotation.x = -Math.PI * 0.5;
	plane.position.y = -0.5;

	const sphereShadow = new THREE.Mesh(
		new THREE.PlaneGeometry(1.5, 1.5),
		new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, alphaMap: shadowTexture })
	);
	sphereShadow.rotation.x = -Math.PI * 0.5;
	sphereShadow.position.y = plane.position.y + 0.01;

	scene.add(sphere, plane, sphereShadow);

	return { sphere, sphereShadow };
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
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	return renderer;
}

/**
 * Setup Debug UI using Lil-GUI
 */
function setupDebugUI(lights, material) {
	const gui = new GUI();

	// Light Controls
	gui.add(lights.ambientLight, 'intensity', 0, 3, 0.001).name('Ambient Light Intensity');
	gui.add(lights.directionalLight, 'intensity', 0, 3, 0.001).name('Directional Light Intensity');
	gui.add(lights.directionalLight.position, 'x', -5, 5, 0.001).name('Dir Light X');
	gui.add(lights.directionalLight.position, 'y', -5, 5, 0.001).name('Dir Light Y');
	gui.add(lights.directionalLight.position, 'z', -5, 5, 0.001).name('Dir Light Z');

	// Material Controls
	gui.add(material, 'metalness', 0, 1, 0.001).name('Metalness');
	gui.add(material, 'roughness', 0, 1, 0.001).name('Roughness');
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

		// Update the sphere's movement
		objects.sphere.position.x = Math.cos(elapsedTime) * 1.5;
		objects.sphere.position.z = Math.sin(elapsedTime) * 1.5;
		objects.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

		// Update the shadow
		objects.sphereShadow.position.x = objects.sphere.position.x;
		objects.sphereShadow.position.z = objects.sphere.position.z;
		objects.sphereShadow.material.opacity = (1 - objects.sphere.position.y) * 0.3;

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
