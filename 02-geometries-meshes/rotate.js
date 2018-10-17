"use strict";

// global variables
var _renderer;
var _scene;
var _camera;

function init ()
{
    // create a scene, that will hold all our elements
    // such as objects, cameras and lights
    _scene = new THREE.Scene();
    loadBackground('../data/textures/stars.png', _scene);


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
    earth.position.set(0, 1, 0);
    _scene.add(earth);

    // add light
    var light = new THREE.SpotLight();
    light.position.set(40, 4, 40);
    light.castShadow = true;
    light.shadowMapEnabled = true;
    light.shadow.camera.near = 20;
    light.shadow.camera.far = 100;
    light.lookAt(earth.position);
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

    loadFont('../data/fonts/earth-moon.json', createText);

    // add the output of the renderer to the html element
    document.body.appendChild(_renderer.domElement);

    // call the render function
    render();
}

function render()
{
    requestAnimationFrame(render);
    
    let earth = _scene.getObjectByName('earth');
    earth && (earth.rotation.y += 0.01);

    let pivotPoint = _scene.getObjectByName('pivotPoint');
    pivotPoint && (pivotPoint.rotation.y -= 0.05);

    let moon = _scene.getObjectByName('moon');
    moon && (moon.rotation.y += 0.01);
    
    _renderer.render(_scene, _camera);
}

function createText(font)
{
    var textGeo = new THREE.TextGeometry("EARTH - MOON", {
        font: font,

        size: 5,
        height: 3,
        curveSegments: 2,

        bevelThickness: 2,
        bevelSize: 5,
        bevelEnable: true
    });

    textGeo.computeBoundingBox();
    // textGeo.computeVertexNormals();

    var textMat = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });

    var text = new THREE.Mesh(textGeo, textMat);

    text.lookAt(_camera.position);
    
    var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    var centerCamera = _camera.position.x / 2;
    text.position.set(centerOffset - centerCamera, 0, 0);
    
    // text.rotation.z = Math.PI / 2;
 
    // text.lookAt(_camera.position);
   
    _scene.add(text);
}

// font
function loadFont(fontName, callback)
{
    var fontLoader = new THREE.FontLoader();
    fontLoader.load(fontName, (font) => {
        callback && callback(font);
    });

    console.log('loadFont ' + fontName);
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

function loadBackground(textureUrl, scene)
{
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureUrl, (texture) => {
        console.log('loadBackground DONE ' + textureUrl);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        scene.background = texture;
        scene.needsUpdate = true;
    });

    console.log('loadBackground ' + textureUrl);
}

