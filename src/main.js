
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
  var loadingManager = new THREE.LoadingManager();


// instantiate a loader
var loader = new THREE.JSONLoader();


var scale = 50.0;

var model = [
	'models/knight.json'
];


var knightMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                       tMatCap: {
                            type: 't',
                            value: THREE.ImageUtils.loadTexture('models/map.jpg')
                        },
                        time: {
                            type: 'f',
                            value: 0
                        },
                        bump: {
                            type: 'f',
                            value: 0
                        },
                        noise: {
                            type: 'f',
                            value: .04
                        },
                        useNormal: {
                            type: 'f',
                            value: 0
                        },
                        normalScale: {
                            type: 'f',
                            value: .5
                        },
                        normalRepeat: {
                            type: 'f',
                            value: 1
                        }
                   }
               })

loader.load('models/knight.json', function ( geometry, materials ) {
	var object = new THREE.Mesh( geometry, knightMaterial );

	object.scale.set(scale,scale,scale);
	object.position.z = -30;
	object.position.x = -24;

	scene.add( object );
});



  //   model.traverse(function(child) {
  //     //This allow us to check if the children is an instance of the Mesh constructor
  //     if (child instanceof THREE.Mesh) {

  //     	child.material = baseMaterial;
  //     	//child.material.color = new THREE.Color( randomColor() );
  //     	//child.material.wireframe = true;

  //     	//console.log(child.name)

  //     	if(child.name == 'body'){
		// 	//console.log('found body');
			
		// 	child.material = bodyMaterial;
		// 	//child.material.transparent = true,
		// 	//child.material.opacity = 0.5;
		// 	//child.material.wireframe = true;

		// 	//console.log(child);

		// }

  //     }
  //   });


};




var loadMercedes = function() {
  //Manager from ThreeJs to track a loader and its status
  var loadingManager = new THREE.LoadingManager();
  //Loader for Obj from Three.js
  //var objLoader = new THREE.OBJLoader(manager);
  //var textureLoader = new THREE.TextureLoader(loadingManager);



    //model.material = baseMaterial;
    //model.material.color = new THREE.Color( randomColor() )

 	//model.material = baseMaterial;


// instantiate a loader
var loader = new THREE.JSONLoader();


var scale = 0.25;

var models = [
	'models/Mercedes/garage.mb_body.js',
	'models/Mercedes/garage.mb_chrome.js',
	'models/Mercedes/garage.mb_glass.js',
	'models/Mercedes/garage.mb_black.js',
	'models/Mercedes/garage.mb_rims.js',
	'models/Mercedes/garage.mb_glossy_black.js',

	'models/Mercedes/garage.mb_brakes.js',
	'models/Mercedes/garage.mb_interior.js',
	'models/Mercedes/garage.mb_lights_glass.js',
	'models/Mercedes/garage.mb_lights.js',
	'models/Mercedes/garage.mb_plastic.js',

	'models/Mercedes/garage.mb_tireFL.js',
	'models/Mercedes/garage.mb_tireFR.js',

	'models/Mercedes/garage.mb_tireRL.js',
	'models/Mercedes/garage.mb_tireRR.js'


];



models.forEach(function(model_url) {
    
	loader.load(
	// resource URL
	model_url,
	// Function when resource is loaded
	function ( geometry, materials ) {
		var material = new THREE.MeshPhongMaterial();
		//material.color = new THREE.Color( randomColor() );

		//



		var object = new THREE.Mesh( geometry, material );

		object.name = model_url.substring(26, model_url.length-3);

		//console.log(object);

		object.scale.set(scale,scale,scale);

		if(object.name == 'body'){
			material.color = new THREE.Color( 0xffffff );
			//material.map = textureLoader.load( 'models/Mercedes/textures/body_lightmap_test.jpg' );
			material.shininess = 100;
		}

		if(object.name == 'interior'){
			//material.color = new THREE.Color( 0xffffff );
			material.map = textureLoader.load( 'models/Mercedes/textures/interior_diffuse.png' );
			material.alphaMap = textureLoader.load( 'models/Mercedes/textures/interior_diffuse.png' );
			//material.transparent = true;
			//m/aterial.opacity = 1;
			//material.shininess = 100;
		}

		if(object.name == 'glass'){
			//material.color = new THREE.Color( 0xffffff );
			//material.map = textureLoader.load( 'models/Mercedes/textures/interior_diffuse.png' );
			//material.shininess = 100;
			material.transparent = true;
			material.opacity = 0.25;
		}

		if(object.name == 'lights_glass'){
			//material.color = new THREE.Color( 0xffffff );
			//material.map = textureLoader.load( 'models/Mercedes/textures/interior_diffuse.png' );
			//material.shininess = 100;
			material.transparent = true;
			material.opacity = 0.25;
		}

		if(object.name.substr(0,4) == 'tire') {
			console.log('TIRE')
			//material.color = new THREE.Color( 0xffffff );
			material.map = textureLoader.load( 'models/Mercedes/textures/tyre_diffuse.jpg' );
			//material.shininess = 100;
		}

		if(object.name == 'rims') {
			console.log('RIMS')
			//material.color = new THREE.Color( 0xffffff );
			material.map = textureLoader.load( 'models/Mercedes/textures/tyre_diffuse.jpg' );
			//material.shininess = 100;
		}

		if(object.name == 'brakes') {
			console.log('BRAKES')
			//material.color = new THREE.Color( 0xffffff );
			material.map = textureLoader.load( 'models/Mercedes/textures/tyre_diffuse.jpg' );
			//material.shininess = 100;
		}


		scene.add( object );
	}
);

});






	//scene.add(model);


    

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