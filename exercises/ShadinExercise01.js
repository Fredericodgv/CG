import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {
    initRenderer,
    InfoBox,
    SecondaryBox,
    initDefaultSpotlight,
    initDefaultDirectionalLighting,
    initDefaultBasicLight,
    createGroundPlane,
    createLightSphere,
    onWindowResize
} from "../libs/util/util.js";

let scene, renderer, camera, stats, light, lightSphere, lightPosition, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer("rgb(30, 30, 42)");    // View function in util/utils
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(2.18, 1.62, 3.31);
camera.up.set(0, 1, 0);
orbit = new OrbitControls(camera, renderer.domElement);
stats = new Stats();          // To show FPS information

// lightPosition = new THREE.Vector3(4, 1.5, 4);
// light = initDefaultDirectionalLighting(scene, lightPosition, 1); // Use default light
// lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);

let ambientLight = new THREE.AmbientLight("rgb(50,50,50)");
scene.add(ambientLight);
let dirPosition = new THREE.Vector3(4, 1, 4)
const dirLight = new THREE.DirectionalLight('white', 1);
dirLight.position.copy(dirPosition);
dirLight.castShadow = true;
//reduz a intensidade da sombra:
dirLight.shadow.mapSize.width = 512;  // default    
scene.add(dirLight);  

// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlane(50, 50, 50, 50); // width and height
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

var infoBox = new SecondaryBox("");


// Teapot basic geometry
var teapotGeo = new TeapotGeometry(0.5);
var cylinderGeo = new THREE.CylinderGeometry(0.05, 0.5, 2, 32);
var sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);

let teapot = createPhongObject(teapotGeo);
teapot.position.set(0.0, 0.5, 0.0);

let sphere = createLambertObject(sphereGeo);
sphere.position.set(-2.0, 0.5, -2.0);

let cylinder = createNormalMaterialFlat(cylinderGeo);
cylinder.position.set(2.0, 0.5, 2.0);



render();

function buildObject(geometry, material) {
    let obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.receiveShadow = true;

    scene.add(obj);
    return obj;
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
function createPhongObject(geometry) {
    let material = new THREE.MeshPhongMaterial({
        color: "rgb(255,20,20)",     // Main color of the object
        shininess: "100",            // Shininess of the object
        specular: "rgb(255,255,255)" // Color of the specular component
    });
    return buildObject(geometry, material);
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshLambertMaterial
function createLambertObject(geometry, position) {
    let material = new THREE.MeshLambertMaterial({
        color: "rgb(20,120,20)"     // Main color of the object
    });
    return buildObject(geometry, material, position);
}


//More information here: https://threejs.org/docs/#api/en/materials/MeshNormalMaterial
function createNormalMaterial(geometry) {
    var material = new THREE.MeshNormalMaterial();

    return buildObject(geometry, material);
}

function createNormalMaterialFlat(geometry) {
    var material = new THREE.MeshNormalMaterial({ flatShading: true });

    return buildObject(geometry, material);
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshToonMaterial
function createToonMaterial(geometry) {
    var material = new THREE.MeshToonMaterial({
        color: "rgb(230,120,50)",     // Main color of the object
    });

    return buildObject(geometry, material);
}

//More information here: https://threejs.org/docs/#api/en/materials/MeshBasicMaterial
function createBasicMaterial(geometry) {
    var material = new THREE.MeshBasicMaterial({
        color: "rgb(255,20,20)"     // Main color of the object
    });

    return buildObject(geometry, material);
}

function createBasicMaterialWireframe(geometry) {
    var material = new THREE.MeshBasicMaterial({
        color: "rgb(255,255,255)",     // Main color of the object
        wireframe: true
    });

    return buildObject(geometry, material);
}

function keyboardUpdate() {
    keyboard.update();
    if (keyboard.pressed("D")) {
        lightPosition.x += 0.05;
        updateLightPosition();
    }
    if (keyboard.pressed("A")) {
        lightPosition.x -= 0.05;
        updateLightPosition();
    }
    if (keyboard.pressed("W")) {
        lightPosition.y += 0.05;
        updateLightPosition();
    }
    if (keyboard.pressed("S")) {
        lightPosition.y -= 0.05;
        updateLightPosition();
    }
    if (keyboard.pressed("E")) {
        lightPosition.z -= 0.05;
        updateLightPosition();
    }
    if (keyboard.pressed("Q")) {
        lightPosition.z += 0.05;
        updateLightPosition();
    }
}

// Update light position of the current light
function updateLightPosition() {
    light.position.copy(lightPosition);
    lightSphere.position.copy(lightPosition);
}

function render()
{
  stats.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
