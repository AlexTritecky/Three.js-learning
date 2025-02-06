import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

	// Mesh
	const mesh = createRandomMesh(50);
	scene.add(mesh);

	// Camera
	const camera = createCamera(sizes);
	scene.add(camera);

	// Controls
	const controls = createControls(camera, canvas);

	// Renderer
	const renderer = createRenderer(canvas, sizes);

	// Event Listeners
	setupEventListeners(camera, renderer, sizes);

	// Start Animation Loop
	animate(renderer, scene, camera, controls);
}

/**
 * Create a mesh with random positions
 */
function createRandomMesh(count) {
	const geometry = new THREE.BufferGeometry();
	const positionsArray = new Float32Array(count * 3 * 3);

	for (let i = 0; i < positionsArray.length; i++) {
		positionsArray[i] = (Math.random() - 0.5) * 4;
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));

	const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

	return new THREE.Mesh(geometry, material);
}

/**
 * Create a camera
 */
function createCamera(sizes) {
	const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
	camera.position.z = 3;
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
 * Setup event listeners (Resize)
 */
function setupEventListeners(camera, renderer, sizes) {
	// Handle window resize
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
function animate(renderer, scene, camera, controls) {
	const clock = new THREE.Clock();

	const tick = () => {
		const elapsedTime = clock.getElapsedTime();

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
