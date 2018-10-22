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

    loadModel('monster', '../data/models/monster.json', '../data/textures/');

    // create a camera, which defines where we looking at
    _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // position and point the camera to the center
    _camera.position.set(10, 10, 50);
    _camera.lookAt(_scene.position);

    // create a renderer, set the background color and size
    _renderer = new THREE.WebGLRenderer( {alpha: true});
    _renderer.setClearColor(0xFF00FF, 1.0);
    _renderer.setSize(window.innerWidth, window.innerHeight);

    _control = new function() {
        this.scale = 0.01;
        
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;

        this.px = 0;
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
    
    let monster = _scene.getObjectByName('monster');
    if (monster)
    {
        monster.scale.set(_control.scale, _control.scale, _control.scale);

        monster.position.set(_control.px, _control.py, _control.pz);

        monster.rotation.set(_control.rx * Math.PI / 180, _control.ry * Math.PI / 180, _control.rz * Math.PI / 180);   
    }
    
    _renderer.render(_scene, _camera);
}

// Model
function loadModel(name, modelUrl, texturesPath)
{
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.setResourcePath(texturesPath);
    jsonLoader.load(modelUrl, 
        (geometry, materials) => {
            console.log('loadModel [' + name +'] finish', materials);

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

    console.log('loadModel ' + modelUrl);
}

function addControls(controlObject)
{
    var gui = new dat.GUI();
    // object - name - min value - max value
    gui.add(controlObject, 'scale', 0.01, 2);
    
    let f1 = gui.addFolder('position');
    f1.open();
    f1.add(controlObject, 'px', -10, 10);
    f1.add(controlObject, 'py', -10, 10);
    f1.add(controlObject, 'pz', -10, 10);

    let f2 = gui.addFolder('rotation');
    f2.close();
    f2.add(controlObject, 'rx', 0, 360);
    f2.add(controlObject, 'ry', 0, 360);
    f2.add(controlObject, 'rz', 0, 360);

}

function initLights() 
{
    var light = new THREE.AmbientLight(0xffffff);
    _scene.add(light);
}



