
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};




var enable_orbitControl = true;




var stats;

window.addEventListener('load', init, false);


function init(event){
	createScene();
	createLights();
	createFloor();

	loadModel();

	//add the listener
	//document.addEventListener('mousemove', handleMouseMove, false);
	
	loop();
}

var scene, camera, cameraTarget, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
	// Get the width and the height of the screen,
	// use them to set up the aspect ratio of the camera 
	// and the size of the renderer.
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// Create the scene
	scene = new THREE.Scene();

	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	scene.fog = new THREE.Fog(Colors.visaBlueDark, 100, 1333);
	
	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);

	scene.add(camera);
	
	cameraTarget = new THREE.Vector3( 0, 50, 0 ); // x, y, z
	//camera.lookAt(cameraTarget);
	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 50;


	//scene.add(camera)

	
	// Create the renderer
	renderer = new THREE.WebGLRenderer({ 
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true, 
		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true 
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);
	
	// Enable shadow rendering
	renderer.shadowMap.enabled = true;
	//renderer.setClearColor( 0x000000, 1 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

	renderer.toneMapping = THREE.LinearToneMapping; // NoToneMapping, LinearToneMapping, ReinhardToneMapping, Uncharted2ToneMapping, CineonToneMapping
	
	// Add the DOM element of the renderer to the 
	// container we created in the HTML
	container = document.getElementById('scene');
	container.appendChild(renderer.domElement);



	//var camhelper = new THREE.CameraHelper( camera );
	//scene.add( camhelper );

	var size = 100;
	var divisions = 10;

	var gridHelper = new THREE.GridHelper( size, divisions );
	scene.add( gridHelper );

	if(enable_orbitControl){
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		////controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
	}
	
	//var helper = new THREE.CameraHelper( camera );
	//scene.add( helper );

	stats = new Stats();
	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
	container.appendChild( stats.dom );


	
	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .8)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .6);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);

	// an ambient light modifies the global color of a scene and makes the shadows softer
	ambientLight = new THREE.AmbientLight(0xdc8874, .7);
	//ambientLight = new THREE.AmbientLight(0xffffff, .25);
	scene.add(ambientLight);
}

function createFloor(){
	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
	///*
	var material = new THREE.MeshStandardMaterial( {
		color: 0xE2E2E2,
		metalness: 0.1
	} );
	var floor = new THREE.Mesh( geometry, material );
	//*/

	//var floor = new THREE.Mesh( geometry );
	floor.material.side = THREE.DoubleSide;
	floor.rotation.x = -Math.PI / 2
	floor.receiveShadow = true;
/*
	this.floorMirror = new THREE.Mirror( this.renderer, this.camera, {
		clipBias: 0.003,
		textureWidth: 1024,
		textureHeight: 1024,
		color: 0xDDDDDD
	} );

	floor.material = this.floorMirror.material;
	floor.add(this.floorMirror);
	*/
	this.scene.add( floor );
}


function loadModel(){
	//Manager from ThreeJs to track a loader and its status
	var loadingManager = new THREE.LoadingManager();
	var objLoader = new THREE.OBJLoader(loadingManager);
	var textureLoader = new THREE.TextureLoader(loadingManager);

	var url = 'models/2b/source/2b.obj';

	var baseMaterial = new THREE.MeshPhongMaterial({
 	 	map: textureLoader.load( 'models/2b/source/color_2048.jpg'),
 	 	shading: THREE.SmoothShading,
 	 	wireframe: false
 	})

	objLoader.load(url, function(object) {
		model = object;
		var scale = 0.3;
		model.scale.set(scale,scale,scale);

		//model.castShadow = true;

		model.traverse(function(child) {
		     if (child instanceof THREE.Mesh) {
				child.material = baseMaterial;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		scene.add(model);
		model.position.x = 0;
		model.position.y = 4.3;
		model.position.z = 0;

	});

};



function randomColor(){
	return '#' + Math.random().toString(16).slice(2, 8)
}


//renderer.render(scene, camera);

function loop(){
	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);

	if(enable_orbitControl){
		controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	}
	stats.update();
}