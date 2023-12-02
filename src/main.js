import '../styles/style.css';
import '../styles/header.css';
import '../styles/hero.css';
import '../styles/utils.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 3D
const scene = new THREE.Scene();

// Sizes
const container = document.querySelector('.content__width');
const sizes = {
    // width: window.innerWidth,
    width: container.clientWidth,
    height: window.innerHeight,
}

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 5, 10);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.2, 100);
camera.position.z = 35;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Background Colour
renderer.setClearColor(0x1e293b);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

// Load Border Collie Model

const loader = new GLTFLoader();
let collieModel;
const modelPath = new URL('../img/border_collie_mesh.glb', import.meta.url).pathname;

loader.load(modelPath, (gltf) => {
    collieModel = gltf.scene;

    // Center the model
    const box = new THREE.Box3().setFromObject(collieModel);
    const center = new THREE.Vector3();
    box.getCenter(center);
    collieModel.position.sub(center);

    scene.add(collieModel);
    animate(); 
});

// Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = container.clientWidth;
    sizes.height = window.innerHeight;
    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};


// Light and Dark Button Click
const lightMode = document.querySelector('.light__mode');
const darkMode = document.querySelector('.dark__mode');
let isTransitioning = false;

function toggleModes(mode1, mode2) {
    if (isTransitioning) {
        return
    }

    isTransitioning = true;

    mode1.classList.toggle('active');
    mode2.classList.toggle('active');
    mode2.classList.toggle('back_up');
    burgerMenuToggle.classList.remove('active');
    
    setTimeout(() => {
        mode1.classList.toggle('back_up');
    }, 400);
    setTimeout(() => {
        isTransitioning = false; 
    }, 600);
}

lightMode.addEventListener('click', () => {
    toggleModes(lightMode, darkMode);
});

darkMode.addEventListener('click', () => {
    toggleModes(darkMode, lightMode);
});

// Light & Dark Toggle 

const themeToggleBtns = document.querySelectorAll('#theme-toggle');

// State
const theme = localStorage.getItem('theme') === 'light-mode'; //check if truthy

// On Mount
if (theme) { //checks the local storage, if theme is truthy, the following code runs
    document.body.classList.add('light-mode');
    lightMode.classList.remove('active');
    darkMode.classList.add('active');
    renderer.setClearColor(0xfff7ed);
}

// Handlers
const handleThemeToggle = () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light-mode');
        renderer.setClearColor(0xfff7ed);
    } else {
        localStorage.removeItem('theme');
        document.body.removeAttribute('class')
        renderer.setClearColor(0x1e293b);
    };
};

// Events
themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', handleThemeToggle);
});


// Burger Menu
const burgerMenuToggle = document.querySelector('.header__burger');

burgerMenuToggle.addEventListener('click', () => {
    burgerMenuToggle.classList.toggle('active');
})

// Footer Date
const currentYear = new Date().getFullYear();
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    yearSpan.textContent = currentYear;
};

