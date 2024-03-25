import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create the objects
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cube = new THREE.Mesh(cubeGeometry, material);

let cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3);
let cylinder1 = new THREE.Mesh(cylinderGeometry, material);
let cylinder2 = new THREE.Mesh(cylinderGeometry, material);
let cylinder3 = new THREE.Mesh(cylinderGeometry, material);
let cylinder4 = new THREE.Mesh(cylinderGeometry, material);


// position the objects
cube.position.set(0.0, 2.0, 0.0);
cube.scale.set(11, 0.3, 6);
cylinder1.position.set(5, 0.5, 2.5);
cylinder2.position.set(-5, .5, 2.5);
cylinder3.position.set(5, .5, -2.5);
cylinder4.position.set(-5, .5, -2.5);

// add the objects to the scene
scene.add(cube);
scene.add(cylinder1);
scene.add(cylinder2);
scene.add(cylinder3);
scene.add(cylinder4);



// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}