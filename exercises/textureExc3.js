import * as THREE from 'three';
import Stats from '../build/jsm/libs/stats.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import {
    initRenderer,
    initCamera,
    initDefaultSpotlight,
    onWindowResize,
    lightFollowingCamera,
    initDefaultDirectionalLighting
} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(10, 0, 10)); // Init camera in this position
var camPosition = new THREE.Vector3(0, 0, 15);
var light = initDefaultDirectionalLighting(scene, camPosition); // Use default light

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls(camera, renderer.domElement);

// Create the cube

let loader = new THREE.TextureLoader();
let geometry = new THREE.BoxGeometry(5, 5, 0.5);


let textureFile = "../assets/textures/NormalMapping/cross.png"
let normalMapFile = "../assets/textures/NormalMapping/crossNormal.png"

// Create boxes with and without normal map
let cube = createMesh(geometry, textureFile, normalMapFile);
cube.castShadow = true;

scene.add(cube);


render();

// Function to set a texture
function setMaterial(file, repeatU = 1, repeatV = 1, offsetX = 0, offsetY = 0, color = 'rgb(255,255,255)') {
    let mat = new THREE.MeshBasicMaterial({ map: loader.load(file), color: color });
    mat.map.colorSpace = THREE.SRGBColorSpace;
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
    mat.map.repeat.set(repeatU, repeatV);
    mat.map.offset.set(offsetX, offsetY);
    return mat;
}

function render() {
    stats.update(); // Update FPS
    trackballControls.update();
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
}

function createMesh(geom, imageFile, normal) {
	let nmap = (normal ? new THREE.TextureLoader().load(normal) : null);
	var tex = new THREE.TextureLoader().load(imageFile);
	    tex.colorSpace = THREE.SRGBColorSpace;   
	var mat = new THREE.MeshPhongMaterial({
		map: tex,
		normalMap: nmap,
      normalScale: new THREE.Vector2(5, 2.5),
	});

    let cubeMaterials = [
        setMaterial('../assets/textures/NormalMapping/crossSide.png'), //x+
        setMaterial('../assets/textures/NormalMapping/crossSide.png'), //x-   
        setMaterial('../assets/textures/NormalMapping/crossSide.png'), //y+
        setMaterial('../assets/textures/NormalMapping/crossSide.png'), //y- 
        mat, //z+
        setMaterial('../assets/textures/NormalMapping/crossSide.png') //z-
    ];

   console.log(mat)

	var mesh = new THREE.Mesh(geom, cubeMaterials);
	return mesh;
}