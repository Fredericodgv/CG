function main()
{
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = initCamera(new THREE.Vector3(7, 7, 7)); // Init camera in this position
  var light  = initDefaultLighting(scene, new THREE.Vector3(7, 7, 7));
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Set angles of rotation
  var angle = [-1.57, 0]; // In degreesToRadians

  //var angle2 = 0;
  var selectedJoint = 0;
  var animationOn = true; // control if animation is on or of

  // Show world axes
  var axesHelper = new THREE.AxesHelper( 12 );
  scene.add( axesHelper );

  var s1 = createSphere();
  scene.add(s1);

  var c1 = createCylinder();
  s1.add(c1);

  var s2 = createSphere();
  c1.add(s2);

  var c2 = createCylinder();
  s2.add(c2);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  buildInterface();
  render();

  function createSphere()
  {
    var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(180,180,255)'} );
    var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    return sphere;
  }

  function createCylinder()
  {
    var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 25);
    var cylinderMaterial = new THREE.MeshPhongMaterial( {color:'rgb(100,255,100)'} );
    var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    return cylinder;
  }

  function rotateCylinder()
  {
    // More info:
    // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
    c1.matrixAutoUpdate = false;
    s2.matrixAutoUpdate = false;
    c2.matrixAutoUpdate = false;

    // Set angle's animation speed
    if(animationOn)
    {
      var mat4 = new THREE.Matrix4();

      // Will execute T1 and then R1
      c1.matrix.identity();  // reset matrix
      c1.matrix.multiply(mat4.makeRotationZ(angle[0])); // R1
      c1.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1

      // Will execute T1 and then R1
      s2.matrix.identity();  // reset matrix
      s2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1

      // Will execute T1 and then R1
      c2.matrix.identity();  // reset matrix
      c2.matrix.multiply(mat4.makeRotationZ(angle[1])); // R1
      c2.matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1
    }
  }

  function buildInterface()
  {
    var controls = new function ()
    {
      this.joint1 = 270;
      this.joint2 = 0;

      this.rotate = function(){
        angle[0] = degreesToRadians(this.joint1);
        angle[1] = degreesToRadians(this.joint2);
        rotateCylinder();
      };
    };

    // GUI interface
    var gui = new dat.GUI();
    gui.add(controls, 'joint1', 0, 360)
      .onChange(function(e) { controls.rotate() })
      .name("First Joint");
    gui.add(controls, 'joint2', 0, 360)
      .onChange(function(e) { controls.rotate() })
      .name("Second Joint");
  }

  function render()
  {
    stats.update(); // Update FPS
    trackballControls.update();
    rotateCylinder();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render); // Show events
    renderer.render(scene, camera) // Render scene
  }
}
