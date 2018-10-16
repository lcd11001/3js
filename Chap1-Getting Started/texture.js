// global variables
var _renderer;
var _scene;
var _camera;

function init ()
{
    // create a scene, that will hold all our elements
    // such as objects, cameras and lights
    _scene = new THREE.Scene();

    // create a camera, which defines where we looking at
    _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // position and point the camera to the center
    _camera.position.set(15, 16, 19);
    _camera.lookAt(_scene.position);

    // create a renderer, set the background color and size
    _renderer = new THREE.WebGLRenderer();
    _renderer.setClearColor(0x000000, 1.0);
    _renderer.setSize(window.innerWidth, window.innerHeight);

    // create a cube and add to scene
    var cubeGeometry = new THREE.BoxGeometry(
        10 * Math.random(),
        10 * Math.random(),
        10 * Math.random()
    );

    var cubeMaterial = new THREE.MeshNormalMaterial();

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = 'cube';
    _scene.add(cube);

    // add the output of the renderer to the html element
    document.body.appendChild(_renderer.domElement);

    loadTexture('../data/textures/box.jpeg');

    loadModel('../data/models/monster.json', '../data/textures/');

    // call the render function
    render();
}

function render()
{
    requestAnimationFrame(render);
    
    let cube = _scene.getObjectByName('cube');
    cube.rotation.z += 0.05;
    
    _renderer.render(_scene, _camera);
}

// Model
function loadModel(modelUrl, texturesPath)
{
    var jsonLoader = new THREE.JSONLoader();
    jsonLoader.setResourcePath(texturesPath);
    jsonLoader.load(modelUrl, onLoadCallback, onProgressCallback, onErrorCallback);

    console.log('loadModel ' + modelUrl);
}

// Texture

function loadTexture(textureUrl)
{
    var texture = THREE.ImageUtils.loadTexture(textureUrl, null, onLoadCallback, onErrorCallback);

    console.log('texture after loadTexture call', texture);
}

function onLoadCallback(loaded)
{
    if (loaded.length)
    {
        console.log('loaded', loaded.length);
    }
    else
    {
        console.log('loaded', loaded)
    }
}

function onProgressCallback(progress)
{
    console.log('progress', progress)
}

function onErrorCallback(error)
{
    console.log('error', error)
}

