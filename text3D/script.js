import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
	const matcapTexture = loadTextures();

	// Load and add text with donuts
	loadText(scene, matcapTexture);

	// Camera
	const camera = createCamera(sizes);
	scene.add(camera);

	// Controls
	const controls = createControls(camera, canvas);

	// Renderer
	const renderer = createRenderer(canvas, sizes);

	// Debug GUI
	setupDebugUI();

	// Event Listeners
	setupEventListeners(camera, renderer, sizes);

	// Start Animation Loop
	animate(renderer, scene, camera, controls);
}

/**
 * Load textures using a texture loader
 */
function loadTextures() {
	const textureLoader = new THREE.TextureLoader();
	const matcapTexture = textureLoader.load('textures/matcaps/8.png');
	matcapTexture.colorSpace = THREE.SRGBColorSpace;
	return matcapTexture;
}

/**
 * Load fonts and create text with donuts
 */
function loadText(scene, matcapTexture) {
	const fontLoader = new FontLoader();

	fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
		// Material
		const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

		// Create text geometry
		const textGeometry = new TextGeometry('Hello Three.js', {
			font,
			size: 0.5,
			depth: 0.2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 5
		});

		textGeometry.center();
		const text = new THREE.Mesh(textGeometry, material);
		scene.add(text);

		// Add donuts
		createDonuts(scene, material);
	});
}

/**
 * Create multiple donuts in the scene
 */
function createDonuts(scene, material) {
	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

	for (let i = 0; i < 100; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);
		donut.position.set(
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10
		);
		donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);

		scene.add(donut);
	}
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
function setupDebugUI() {
	const gui = new GUI();
	gui.add({ message: 'Hello Three.js' }, 'message');
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
