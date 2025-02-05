import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Initialize the scene, camera, and renderer
 */
function init() {
	// Canvas
	const canvas = document.querySelector('canvas.webgl');

	// Scene
	const scene = new THREE.Scene();

	// Create the mesh and add to scene
	const mesh = createMesh();
	scene.add(mesh);

	// Sizes
	const sizes = { width: window.innerWidth, height: window.innerHeight };

	// Camera
	const camera = createCamera(sizes);
	scene.add(camera);

	// Renderer
	const renderer = createRenderer(canvas, sizes);

	// Handle window resize
	window.addEventListener('resize', () => onWindowResize(camera, renderer, sizes));

	// Start Animation
	animateMesh(mesh);
	animate(renderer, scene, camera);
}

/**
 * Create a mesh
 */
function createMesh() {
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
 * Create a WebGL renderer
 */
function createRenderer(canvas, sizes) {
	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	return renderer;
}

/**
 * Handle window resize
 */
function onWindowResize(camera, renderer, sizes) {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
}

/**
 * Animate the mesh using GSAP
 */
function animateMesh(mesh) {
	gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
}

/**
 * Animation loop
 */
function animate(renderer, scene, camera) {
	const tick = () => {
		renderer.render(scene, camera);
		requestAnimationFrame(tick);
	};
	tick();
}

// Initialize the scene
init();
