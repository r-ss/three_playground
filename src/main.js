
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};




var enable_orbitControl = true;

var uniforms;
var normalMap;
var cleanNormalMapBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAAA1BMVEWAgP9QzlGcAAAAGElEQVRIx2MYBaNgFIyCUTAKRsEooDMAAAiAAAGNmLNuAAAAAElFTkSuQmCC'



var stats;

window.addEventListener('load', init, false);


function init(event){
	createScene();
	createLights();
	createFloor();

	loadNormalMapTexture(); // Preloading texture and then model;

	//loadModel();

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
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .5)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .35);

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
	//ambientLight = new THREE.AmbientLight(0xdc8874, .6);
	ambientLight = new THREE.AmbientLight(0xffffff, .35);
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



var loadingManager = new THREE.LoadingManager();

function loadNormalMapTexture(){
	var normalMapLoader = new THREE.TextureLoader(loadingManager);
	normalMapLoader.load(cleanNormalMapBase64, loadModel);
}

function loadModel(normalMapTexture){
	//Manager from ThreeJs to track a loader and its status
	
	var objLoader = new THREE.OBJLoader(loadingManager);
	var textureLoader = new THREE.TextureLoader(loadingManager);

	//var url_model = 'models/2b/source/2b.obj';
	//var url_texture = 'models/2b/source/color_2048.jpg';
	//var model_scale = 0.3;

	var url_model = 'models/lexus_lx_stanislav/LX_570_naming.obj';
	var model_scale = 0.15;

	// var normalMapLoader = new THREE.TextureLoader(loadingManager);
	// normalMapLoader.load(cleanNormalMapBase64, function (texture) {
	// 	normalMap = texture;
	// 	//loop();
	// });


 	// var normalMap = THREE.ImageUtils.loadTexture( cleanNormalMapBase64, null, function(something){
  //      loop();
  //    } );


// Add skybox
    var folder = "models/skybox-studio/"
    // var urls = [ folder+"right.png", folder+"left.png",
    //              folder+"up.png", folder+"down.png",
    //              folder+"front.png", folder+"back.png" ];
    var urls = [ folder+"front.png", folder+"front.png",
                 folder+"front.png", folder+"front.png",
                 folder+"front.png", folder+"front.png" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    // Skybox
    var skyshader = THREE.ShaderLib[ "cube" ];
    skyshader.uniforms[ "tCube" ].value = textureCube;

    var skymaterial = new THREE.ShaderMaterial( {

      fragmentShader: skyshader.fragmentShader,
      vertexShader: skyshader.vertexShader,
      uniforms: skyshader.uniforms,
      depthWrite: false,
      side: THREE.BackSide

    } );

    sky = new THREE.Mesh( new THREE.BoxGeometry( 1500, 1500, 1500 ), skymaterial );
    sky.visible = false;
    scene.add( sky );









    var uniforms = {
        paintColor1: { type: "c", value: new THREE.Color('rgb(150,150,150)') },
        paintColor2: { type: "c", value: new THREE.Color('rgb(157,160,137)') },
        paintColor3: { type: "c", value: new THREE.Color('rgb(114,157,180)') },
        //paintColor1: { type: "c", value: new THREE.Color('rgb(22,25,35)') },
        //paintColor2: { type: "c", value: new THREE.Color('rgb(0,0,0)') },

        normalMap: { type: "t", value: normalMapTexture},
        glossLevel: { type: "f", value: 2.2, min: 0.0, max: 5.0},
        brightnessFactor: {type: "f", value: 0.55, min: 0.0, max: 1.0},
        envMap: { type: "t", value: textureCube}
    };
    var vertexShader = document.getElementById('vertexShader').text;
    var fragmentShader = document.getElementById('fragmentShader').text;
    var fragmentShaderGlass = document.getElementById('fragmentShaderGlass').text;
    material = new THREE.ShaderMaterial(
    {
      uniforms : uniforms,
      vertexShader : vertexShader,
      fragmentShader : fragmentShader,
      extensions: {
			derivatives: true, // set to use derivatives
			fragDepth: false, // set to use fragment depth values
			drawBuffers: false, // set to use draw buffers
			shaderTextureLOD: false // set to use shader texture LOD
	  }
    });

    var uniformsGlass = {
        paintColor1: { type: "c", value: new THREE.Color('rgb(40,40,50)') },
        //paintColor3: { type: "c", value: new THREE.Color('rgb(114,157,180)') },
        normalMap: { type: "t", value: normalMapTexture},
        glossLevel: { type: "f", value: 0.1, min: 0.0, max: 5.0},
        brightnessFactor: {type: "f", value: 0.35, min: 0.0, max: 1.0},
        envMap: { type: "t", value: textureCube}
    };


    var glassMaterial = new THREE.ShaderMaterial(
    {
      uniforms : uniformsGlass,
      vertexShader : vertexShader,
      fragmentShader : fragmentShaderGlass,
      extensions: {
			derivatives: true, // set to use derivatives
			fragDepth: false, // set to use fragment depth values
			drawBuffers: false, // set to use draw buffers
			shaderTextureLOD: false // set to use shader texture LOD
	  },
	  transparent: true
    });


	var baseMaterial = new THREE.MeshPhongMaterial({
		color: 0xe2e2e2,
 	 	shading: THREE.SmoothShading,
        shininess: 15.0,
        emissive: 0x050505,
        specular: 0xaaaaaa
 	})

 	var baseMaterial = material;

 	var tireMaterial = new THREE.MeshPhongMaterial({
 		color: 0x303030,
 	 	shading: THREE.SmoothShading,
 	 	wireframe: false
 	})
/*
 	var glassMaterial = new THREE.MeshPhongMaterial({
 		color: 0x252525,
 	 	shading: THREE.SmoothShading,
 	 	transparent: true, 
 	 	opacity: 0.90,
 	 	wireframe: false,
 	 	shininess: 75.0,
        emissive: 0x050505,
        specular: 0xbbbbbb
 	})
 	*/

 	var chromeMaterial = new THREE.MeshPhongMaterial({
 		color: 0x959595,
        shininess: 100.0,
        emissive: 0x151515,
        specular: 0xffffff
 	})

	//mtlLoader.load( mtl_url, function( materials ) {

		//objLoader.setMaterials( materials );

		objLoader.load(url_model, function(object) {
			model = object;
			model.scale.set(model_scale,model_scale,model_scale);

			//model.castShadow = true;

			model.traverse(function(child) {
			     if (child instanceof THREE.Mesh) {
			     	var name = child.name;

					child.material = baseMaterial;
					child.castShadow = true;
					child.receiveShadow = true;

					if(name.startsWith('Tire')){
						child.material = tireMaterial;
					}
					if(name.startsWith('Glass')){
						child.material = glassMaterial;
					}
					if(name.startsWith('Disk')){
						child.material = chromeMaterial;
					}
				}
			});

			scene.add(model);
			model.position.x = 0;
			model.position.y = 0;
			model.position.z = 0;

			//model.rotateX(-Math.PI / 2);

		});
	//});

	setupGuiControls(uniforms); // All shit is loaded, now can setup controls

};



function randomColor(){
	return '#' + Math.random().toString(16).slice(2, 8)
}


//renderer.render(scene, camera);

function loop(){
	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);

	//camera.position.z = guicontrols.cameraPositionZ;

	if(enable_orbitControl){
		controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
	}
	stats.update();
}

var guicontrols = new function() {
 
}


function setupGuiControls(ob){
	var gui = new dat.GUI();
	var sceneFolder = gui.addFolder('Scene');
	//var ob = uniforms;
    //var geoController = sceneFolder.add({Geometry:"box"}, 'Geometry', [ 'box', 'sphere', 'torusknot' ] );
    //geoController.onChange(changeGeometry);
    sceneFolder.add(sky, 'visible').name('Show Cubemap').onChange(function(){render();});
    sceneFolder.open();
    var uniformsFolder = gui.addFolder('Uniforms');
    for(key in ob){
      if(ob[key].type == 'f'){
        var controller = uniformsFolder.add(ob[key], 'value').name(key);
        if(typeof ob[key].min != 'undefined'){
          controller = controller.min(ob[key].min).name(key);
        }
        if(typeof ob[key].max != 'undefined'){
          controller = controller.max(ob[key].max).name(key);
        }
        controller.onChange(function(value){
          this.object.value = parseFloat(value);
          //loop();
         });
      }else if(ob[key].type == 'c'){
        ob[key].guivalue = [ob[key].value.r * 255, ob[key].value.g * 255, ob[key].value.b * 255];
        var controller = uniformsFolder.addColor(ob[key], 'guivalue').name(key);
        controller.onChange(function(value){
          this.object.value.setRGB(value[0]/255, value[1]/255, value[2]/255);
          //loop();
        });
      }
    }
    uniformsFolder.open();
}
