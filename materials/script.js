import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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

    // Load environment map
    loadEnvironmentMap(scene);

    // Materials
    const material = createMaterial(textures);

    // Meshes
    const meshes = createMeshes(material);
    scene.add(...meshes);

    // Camera
    const camera = createCamera(sizes);
    scene.add(camera);

    // Controls
    const controls = createControls(camera, canvas);

    // Renderer
    const renderer = createRenderer(canvas, sizes);

    // Debug GUI
    setupDebugUI(material);

    // Event Listeners
    setupEventListeners(camera, renderer, sizes);

    // Start Animation Loop
    animate(renderer, scene, camera, controls, meshes);
}

/**
 * Load textures using a texture loader
 */
function loadTextures() {
    const textureLoader = new THREE.TextureLoader();

    const loadTexture = (path) => textureLoader.load(path);

    return {
        doorColor: loadTexture('./textures/door/color.jpg'),
        doorAlpha: loadTexture('./textures/door/alpha.jpg'),
        doorAO: loadTexture('./textures/door/ambientOcclusion.jpg'),
        doorHeight: loadTexture('./textures/door/height.jpg'),
        doorNormal: loadTexture('./textures/door/normal.jpg'),
        doorMetalness: loadTexture('./textures/door/metalness.jpg'),
        doorRoughness: loadTexture('./textures/door/roughness.jpg'),
        matcap: loadTexture('./textures/matcaps/8.png'),
        gradient: loadTexture('./textures/gradients/5.jpg'),
    };
}

/**
 * Load HDR Environment Map
 */
function loadEnvironmentMap(scene) {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = environmentMap;
        scene.environment = environmentMap;
    });
}

/**
 * Create a physical material
 */
function createMaterial(textures) {
    const material = new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0.15,
        transmission: 1,
        ior: 1.5,
        thickness: 0.5,
    });

    return material;
}

/**
 * Create geometries and meshes
 */
function createMeshes(material) {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        material
    );
    sphere.position.x = -1.5;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 100, 100),
        material
    );

    const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 64, 128),
        material
    );
    torus.position.x = 1.5;

    return [sphere, plane, torus];
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
function setupDebugUI(material) {
    const gui = new GUI();

    gui.add(material, 'metalness', 0, 1, 0.0001);
    gui.add(material, 'roughness', 0, 1, 0.0001);
    gui.add(material, 'transmission', 0, 1, 0.0001);
    gui.add(material, 'ior', 1, 10, 0.0001);
    gui.add(material, 'thickness', 0, 1, 0.0001);
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
function animate(renderer, scene, camera, controls, meshes) {
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        meshes.forEach(mesh => {
            mesh.rotation.y = 0.1 * elapsedTime;
            mesh.rotation.x = -0.15 * elapsedTime;
        });

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
