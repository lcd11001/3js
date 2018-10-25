"use strict";

// global variables
var _renderer;
var _scene;
var _camera;
var _control;

function init ()
{
    // create a scene, that will hold all our elements
    // such as objects, cameras and lights
    _scene = new THREE.Scene();

    // loadModelJson('monster', '../data/models/monster.json', '../data/textures/');

    initLoader('../data/textures/Porsche/');
    loadModelFbx('car', '../data/models/car_porsche_911_GTS_2018_carpaint_diffuse.fbx', '../data/textures/Porsche/');
    loadModelFbx2('car2', '../data/models/car_porsche_911_GTS_2018_carpaint_diffuse.fbx', '../data/textures/Porsche/');

    // create a camera, which defines where we looking at
    _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // position and point the camera to the center
    _camera.position.set(0, 30, 50);
    _camera.lookAt(_scene.position);

    // create a renderer, set the background color and size
    _renderer = new THREE.WebGLRenderer( {alpha: true});
    _renderer.setClearColor(0xFF00FF, 1.0);
    _renderer.setSize(window.innerWidth, window.innerHeight);

    _control = new function() {
        this.scale = 0.1;
        
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;

        this.px = 20;
        this.py = 0;
        this.pz = 0;
    }
    addControls(_control);

    initLights();

    // add the output of the renderer to the html element
    document.body.appendChild(_renderer.domElement);

    // call the render function
    render();
}

function render()
{
    requestAnimationFrame(render);
    
    let car = _scene.getObjectByName('car');
    if (car)
    {
        car.scale.set(_control.scale, _control.scale, _control.scale);

        car.position.set(-_control.px, _control.py, _control.pz);

        car.rotation.set(_control.rx * Math.PI / 180, _control.ry * Math.PI / 180, _control.rz * Math.PI / 180);   
    }

    let car2 = _scene.getObjectByName('car2');
    if (car2)
    {
        car2.scale.set(_control.scale, _control.scale, _control.scale);

        car2.position.set(_control.px, _control.py, _control.pz);

        car2.rotation.set(_control.rx * Math.PI / 180, _control.ry * Math.PI / 180, _control.rz * Math.PI / 180);   
    }
    
    _renderer.render(_scene, _camera);
}

// Model
function loadModelJson(name, modelUrl, texturesPath)
{
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.setResourcePath(texturesPath);
    jsonLoader.load(modelUrl, 
        (geometry, materials) => {
            console.log('loadModelJson [' + name +'] finish', materials);

            // let material = materials[0];
            // material.morphTargets = true;
            materials.forEach(element => {
                element.morphTargets = true;
                // element.needsUpdate = true;
                
                // element.map.flipY = false;
                // element.map.needsUpdate = true;
            });

            let mesh = new THREE.Mesh(geometry, materials);
            
            mesh.translation = geometry.center;
            mesh.name = name;
            _scene.add(mesh);
        }, 
        null, null);

    console.log('loadModelJson ' + modelUrl);
}

function loadModelFbx(name, modelUrl, texturesPath)
{
    var fbxLoader = new THREE.FBXLoader();
    fbxLoader.setResourcePath(texturesPath);
    fbxLoader.load(modelUrl, 
        (sceneGraph) => {
            console.log('loadModelFbx [' + name +'] finish', sceneGraph);
            sceneGraph.name = name;
            // sceneGraph.position.set(-0.5, 0, 0);
            _scene.add(sceneGraph);
        },
        null, null);

    console.log('loadModelFbx ' + modelUrl);
}

function loadModelFbx2(name, modelUrl, texturesPath)
{
    var fbxLoader = new THREE.FBXLoader2();
    fbxLoader.setResourcePath(texturesPath);
    fbxLoader.load(modelUrl, 
        (sceneGraph) => {
            console.log('loadModelFbx2 [' + name +'] finish', sceneGraph);
            sceneGraph.name = name;
            // sceneGraph.position.set(0.5, 0, 0);
            _scene.add(sceneGraph);
        },
        null, null);

    console.log('loadModelFbx2 ' + modelUrl);
}

function addControls(controlObject)
{
    var gui = new dat.GUI();
    // object - name - min value - max value
    gui.add(controlObject, 'scale', 0.01, 2);
    
    let f1 = gui.addFolder('position');
    f1.close();
    f1.add(controlObject, 'px', -100, 100);
    f1.add(controlObject, 'py', -100, 100);
    f1.add(controlObject, 'pz', -100, 100);

    let f2 = gui.addFolder('rotation');
    f2.open();
    f2.add(controlObject, 'rx', 0, 360);
    f2.add(controlObject, 'ry', 0, 360);
    f2.add(controlObject, 'rz', 0, 360);

}

function initLights() 
{
    var light = new THREE.AmbientLight(0xffffff);
    _scene.add(light);
}

function initLoader(path)
{
    let tgaLoader = new THREE.TGALoader(THREE.DefaultLoadingManager);
    tgaLoader.setPath(path);
    THREE.Loader.Handlers.add(/\.tga$/i, tgaLoader);
}



