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

    // Load textures
    const textures = loadTextures();

    // Mesh
    const mesh = createMesh(textures.colorTexture);
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
 * Load textures using a loading manager
 */
function loadTextures() {
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = () => console.log('Loading started');
    loadingManager.onLoad = () => console.log('Loading finished');
    loadingManager.onProgress = () => console.log('Loading in progress');
    loadingManager.onError = () => console.log('Loading error');

    const textureLoader = new THREE.TextureLoader(loadingManager);

    const colorTexture = textureLoader.load(
        '/textures/minecraft.png',
        () => console.log('Texture loaded successfully'),
        () => console.log('Texture loading in progress'),
        () => console.log('Texture loading error')
    );

    colorTexture.colorSpace = THREE.SRGBColorSpace;
    colorTexture.wrapS = THREE.MirroredRepeatWrapping;
    colorTexture.wrapT = THREE.MirroredRepeatWrapping;
    colorTexture.generateMipmaps = false;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.magFilter = THREE.NearestFilter;

    return {
        colorTexture,
        alphaTexture: textureLoader.load('/textures/door/alpha.jpg'),
        heightTexture: textureLoader.load('/textures/door/height.jpg'),
        normalTexture: textureLoader.load('/textures/door/normal.jpg'),
        ambientOcclusionTexture: textureLoader.load('/textures/door/ambientOcclusion.jpg'),
        metalnessTexture: textureLoader.load('/textures/door/metalness.jpg'),
        roughnessTexture: textureLoader.load('/textures/door/roughness.jpg'),
    };
}

/**
 * Create a mesh with a texture
 */
function createMesh(texture) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    return new THREE.Mesh(geometry, material);
}

/**
 * Create a camera
 */
function createCamera(sizes) {
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(1, 1, 1);
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
