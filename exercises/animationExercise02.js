import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    onWindowResize,
    createGroundPlaneXZ
} from "../libs/util/util.js";
import { SphereGeometry } from '../build/three.module.js';

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper(12);
scene.add(axesHelper);

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
let sphere1 = new THREE.Mesh(sphereGeometry, material);
let sphere2 = new THREE.Mesh(sphereGeometry, material)

sphere1.position.set(-7, 1, -5);
sphere2.position.set(-7, 1, 5);

scene.add(sphere1);
scene.add(sphere2);

let reset = {
    reset: false
};

const sphere1Lerp = {
    destination: new THREE.Vector3(7, 1, -5),
    alpha: 0.03,
    move: false
}
const sphere2Lerp = {
    destination: new THREE.Vector3(7, 1, 5),
    alpha: 0.01,
    move: false
}

buildInterface();
render();

function moveSphere(speed) {
    
}

function buildInterface() {
    var controls = new function () {
        this.reset = function () {
           reset.reset = true;
        };
     };

    let gui = new GUI();
    let folder = gui.addFolder("Moving Spheres");
    folder.open();
    folder.add(sphere1Lerp, "move", true)
        .name("Move Sphere 1")
    folder.add(sphere2Lerp, "move", true)
        .name("Move Sphere 2");
    folder.add(controls, "reset").name("Reset");
}
function render() {

    if (sphere1Lerp.move) sphere1.position.lerp(sphere1Lerp.destination, sphere1Lerp.alpha);
    if (sphere2Lerp.move) sphere2.position.lerp(sphere2Lerp.destination, sphere2Lerp.alpha);
    if (reset.reset) {

        sphere1.position.set(-7, 1, -5);
        sphere2.position.set(-7, 1, 5);
        reset.reset = false;
    }


    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
}