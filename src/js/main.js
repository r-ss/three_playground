
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

	loadModel();

	//add the listener
	//document.addEventListener('mousemove', handleMouseMove, false);
	
	loop();
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

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
	
	// Set the position of the camera

	
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



	camera.position.x = 0;
	camera.position.z = -290;
	camera.position.y = 90;

	
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
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .4)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .5);

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
	//ambientLight = new THREE.AmbientLight(0xdc8874, .5);
	ambientLight = new THREE.AmbientLight(0xffffff, .25);
	scene.add(ambientLight);
}


// function loadModel() {
// 	// THREE.loadOBJModel('models/porsche_911_gt2.obj', function( model ){
// 	// 	console.log('loaded xD');
// 	// })

// 	var url = 'models/porsche_911_gt2.obj';
// 	var loader = new THREE.OBJLoader();
// 	loader.load( url, function ( object ) {
// 		doneHandler && doneHandler( object );
// 	}, function( e ){
// 		progresshandler && progresshandler(e.loaded / e.total);
// 	}, function(){
// 		errorHandler && errorHandler();
// 	});
// }

var loadModel = function() {
  //Manager from ThreeJs to track a loader and its status
  //var manager = new THREE.LoadingManager();
  //Loader for Obj from Three.js
  //var objLoader = new THREE.OBJLoader(manager);
  //var textureLoader = new THREE.TextureLoader(manager);

  //var texture = textureLoader.load('models/pony-cartoon/model.jpg');
  //texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // CHANGED
  //texture.offset.set( 29 / 100, 48 / 100); // CHANGED
  //texture.repeat.set( 1, 7 ); // CHANGED




var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};

var onError = function ( xhr ) { };

THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath( 'models/pony-cartoon/source/' );
mtlLoader.load( 'Pony_cartoon.mtl', function( materials ) {

	//materials.preload();

	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials( materials );
	objLoader.setPath( 'models/pony-cartoon/source/' );
	objLoader.load( 'Pony_cartoon.obj', function ( object ) {

		//object.position.y = - 95;

		var s = 0.1;
		object.scale.set(s,s,s)

		scene.add( object );

	}, onProgress, onError );

});



/*
  var model;

  //Launch loading of the obj file, addBananaInScene is the callback when it's ready 
  objLoader.load('models/pony-cartoon/model.obj', function(object) {
    model = object;
    var scale = 30;
    model.scale.set(scale,scale,scale);
    model.position.x = 0;
    model.position.y = 0; //21;
    model.position.z = 0;


    

    var baseMaterial = new THREE.MeshPhongMaterial({
 	 	map: texture,
 	 	shading: THREE.SmoothShading,
 	 	wireframe: true
 	})


    model.traverse(function(child) {
      //This allow us to check if the children is an instance of the Mesh constructor
      if (child instanceof THREE.Mesh) {

      	child.material = baseMaterial;
      	//child.material.color = new THREE.Color( randomColor() );
      	//child.material.wireframe = true;

      	//console.log(child.name)

      	if(child.name == 'body'){
			//console.log('found body');
			
			child.material = bodyMaterial;
			//child.material.transparent = true,
			//child.material.opacity = 0.5;
			//child.material.wireframe = true;

			//console.log(child);

		}

      }
    });


    //model.material = baseMaterial;
    //model.material.color = new THREE.Color( randomColor() )

 	//model.material = baseMaterial;



	scene.add(model);

*/


 //    textureLoader.load('models/map.jpg', function( texture ){
	//   	console.log('texture loaded')
	//   	baseMaterial = new THREE.MeshPhongMaterial({
	// 		map: texture,
	// 		reflectivity: 0.2,
	// 		shading: THREE.SmoothShading
	// 	});

	// 	model.material = baseMaterial;
	// 	scene.add(model);


	// });

	// model.children.forEach(function(child) {
	// 		var material = child.material;
 
 //             // basic texture
 //             material.map = texture;
	// });


    /*
    //Go through all children of the loaded object and search for a Mesh
    object.traverse(function(child) {
      //This allow us to check if the children is an instance of the Mesh constructor
      if (child instanceof THREE.Mesh) {
       
      	//child.material.map = texture;
        var name = child.name;
		if(name == 'body'){
			console.log('found body');
			
			child.material = baseMaterial;
			//child.material.transparent = true,
			//child.material.opacity = 0.5;

			console.log(child);

		}
		// else {
		// 	mesh.material = baseMaterial;
		// }

        //child.material = baseMaterial;
        //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
        //child.geometry.computeVertexNormals();
      }
    });
    */
    
    

    
    
    



  //});
};


function randomColor(){
	return '#' + Math.random().toString(16).slice(2, 8)
}

// Instantiate the sea and add it to the scene:

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen


//renderer.render(scene, camera);

function loop(){


	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);

	if(enable_orbitControl){
	controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	}
	stats.update();
}