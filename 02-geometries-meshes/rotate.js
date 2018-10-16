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
    _camera.position.set(25, 26, 23);
    _camera.lookAt(_scene.position);

    // create a renderer, set the background color and size
    _renderer = new THREE.WebGLRenderer();
    _renderer.setClearColor(0x000000, 1.0);
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _renderer.shadowMap.enabled = true;
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // create a earth and add to scene
    var earthGeometry = new THREE.SphereGeometry(6.5, 20, 20);

    var earthMaterial = new THREE.MeshBasicMaterial();
    // earthMaterial.map = THREE.ImageUtils.loadTexture('../data/textures/earth.jpg');
    loadTexture('../data/textures/earth.jpg', earthMaterial);

    var earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.name = 'earth';
    earth.receiveShadow = true;
    earth.rotation.x = -0.5;
    _scene.position.set(0, 1, 0);
    _scene.add(earth);

    // add light
    var light = new THREE.SpotLight();
    light.position.set(40, 4, 40);
    light.castShadow = true;
    light.shadowMapEnabled = true;
    light.shadow.camera.near = 20;
    light.shadow.camera.far = 100;
    _scene.add(light);

    // add pivot
    var pivotPoint = new THREE.Object3D();
    pivotPoint.name = 'pivotPoint';
    earth.add(pivotPoint);


    // create a moon and add to the pivot point
    var moonGeometry = new THREE.SphereGeometry(1, 20, 20);

    var moonMaterial = new THREE.MeshBasicMaterial();
    // moonMaterial.map = THREE.ImageUtils.loadTexture('../data/textures/moon.jpeg');
    loadTexture('../data/textures/moon.jpeg', moonMaterial);

    var moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = 'moon';
    moon.position.set(10, 0, 0);
    moon.castShadow = true;
    pivotPoint.add(moon);

    // add the output of the renderer to the html element
    document.body.appendChild(_renderer.domElement);

    // call the render function
    render();
}

function render()
{
    requestAnimationFrame(render);
    
    let earth = _scene.getObjectByName('earth');
    earth.rotation.y += 0.01;

    let pivotPoint = _scene.getObjectByName('pivotPoint');
    pivotPoint.rotation.y -= 0.05;

    let moon = _scene.getObjectByName('moon');
    moon.rotation.y += 0.01;
    
    _renderer.render(_scene, _camera);
}

// texture
function loadTexture(textureUrl, material)
{
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
        console.log('loadTexture DONE ' + textureUrl);
        material.map = texture;
        material.needsUpdate = true;
    });

    console.log('loadTexture ' + textureUrl);
}