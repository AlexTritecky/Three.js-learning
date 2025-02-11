import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
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

	// Mesh
	const { mesh, material, debugObject } = createMesh();
	scene.add(mesh);

	// Debug UI
	setupDebugUI(mesh, material, debugObject);

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
 * Create a mesh and material with debugging options
 */
function createMesh() {
	const debugObject = { color: '#a778d8', subdivision: 2 };

	const geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
	const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true });
	const mesh = new THREE.Mesh(geometry, material);

	return { mesh, material, debugObject };
}

/**
 * Create and configure Lil-GUI for debugging
 */
function setupDebugUI(mesh, material, debugObject) {
	const gui = new GUI({ width: 300, title: 'Nice debug UI', closeFolders: false });

	// Toggle GUI visibility with "h" key
	window.addEventListener('keydown', (event) => {
		if (event.key === 'h') gui.show(gui._hidden);
	});

	const cubeTweaks = gui.addFolder('Awesome cube');

	cubeTweaks.add(mesh.position, 'y', -3, 3, 0.01).name('Elevation');
	cubeTweaks.add(mesh, 'visible');
	cubeTweaks.add(material, 'wireframe');
	cubeTweaks.addColor(debugObject, 'color').onChange(() => material.color.set(debugObject.color));

	debugObject.spin = () => gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
	cubeTweaks.add(debugObject, 'spin');

	cubeTweaks.add(debugObject, 'subdivision', 1, 20, 1).onFinishChange(() => {
		mesh.geometry.dispose();
		mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
	});
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
