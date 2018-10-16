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

    var cubeMaterial = new THREE.MeshBasicMaterial();
    cubeMaterial.map = THREE.ImageUtils.loadTexture('../data/textures/debug.png');

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = 'cube';
    _scene.add(cube);

    // add the output of the renderer to the html element
    document.body.appendChild(_renderer.domElement);

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

// drag drop
function setupDragDrop()
{
    var holder = document.getElementById('holder');

    holder.ondragover = function(e) {
        e.target.className = 'hover';
        return false;
    }

    holder.ondragend = function(e) {
        e.target.className = '';
        return false;
    }

    holder.ondragleave = function(e) {
        e.target.className = 'leave';
        return false;
    }

    holder.ondrop = function(e) {
        e.target.className = '';
        e.preventDefault();

        var file = e.dataTransfer.files[0];
        var reader = new FileReader();

        reader.onload = function(event) {
            holder.style.background = 'url(' + event.target.result + ') no-repeat center';

            var image = document.createElement('img');
            image.src = event.target.result;

            var texture = new THREE.Texture(image);
            texture.needsUpdate = true;

            _scene.getObjectByName('cube').material.map = texture;
            // _scene.getObjectByName('cube').material.needsUpdate = true;
        }

        reader.readAsDataURL(file);

        return false;
    }
}

