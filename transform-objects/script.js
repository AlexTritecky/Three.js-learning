import * as THREE from 'three';

/**
 * Initialize the scene, camera, and renderer
 */
function init() {
	// Canvas
	const canvas = document.querySelector( 'canvas.webgl' );

	// Scene
	const scene = new THREE.Scene();

	// Axes Helper
	const axesHelper = new THREE.AxesHelper(2);
	scene.add( axesHelper );

	// Create and add objects
	const group = createGroup();
	scene.add( group );

	// Camera
	const sizes = { width: window.innerWidth, height: window.innerHeight };
	const camera = createCamera( sizes );
	scene.add( camera );

	// Renderer
	const renderer = createRenderer( canvas, sizes );

	// Handle window resize
	window.addEventListener( 'resize', () => onWindowResize( camera, renderer, sizes ) );

	// Render the scene
	renderer.render( scene, camera );
}

/**
 * Create a group of cubes
 */
function createGroup() {
	const group = new THREE.Group();
	group.scale.y = 2;
	group.rotation.y = 0.2;

	const positions = [-1.5, 0, 1.5];
	positions.forEach( posX => {
		const cube = createCube( 0xff0000 );
		cube.position.x = posX;
		group.add( cube );
	});

	return group;
}

/**
 * Create a single cube
 */
function createCube( color ) {
	return new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshBasicMaterial( { color } )
	);
}

/**
 * Create a camera
 */
function createCamera( sizes ) {
	const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 100 );
	camera.position.z = 3;
	return camera;
}

/**
 * Create a WebGL renderer
 */
function createRenderer( canvas, sizes ) {
	const renderer = new THREE.WebGLRenderer( { canvas } );
	renderer.setSize(sizes.width, sizes.height);
	return renderer;
}

/**
 * Handle window resize events
 */
function onWindowResize( camera, renderer, sizes ) {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize( sizes.width, sizes.height );
	renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
}

// Initialize the scene
init();
