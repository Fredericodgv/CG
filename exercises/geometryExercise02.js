import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from '../build/jsm/loaders/OBJLoader.js';
import { PLYLoader } from '../build/jsm/loaders/PLYLoader.js';
import { MTLLoader } from '../build/jsm/loaders/MTLLoader.js';
import {
    initRenderer,
    initDefaultBasicLight,
    createGroundPlane,
    SecondaryBox,
    onWindowResize,
    getMaxSize
} from "../libs/util/util.js";

let scene, renderer, camera, orbit, light;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2.18, 2, 3.31);
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.
orbit.target.set(0, .5, 0);
orbit.update();

light = initDefaultBasicLight(scene, true); // Use default light

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

let loadingMessage = new SecondaryBox("Loading...");

var groundPlane = createGroundPlane(7.0, 7.0, 100, 100); // width and height
groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

//---------------------------------------------------------
// Load external objects


let loader = new GLTFLoader();
loader.load('../assets/objects/toon_tank.glb', function (gltf) {
    let obj = gltf.scene;
    obj.traverse(function (child) {
        if (child) {
            child.castShadow = true;
        }
    }
    );
    scene.add(obj);
}, null, null);

render();



function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}
