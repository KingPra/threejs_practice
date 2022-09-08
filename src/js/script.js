import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/Orbitcontrols.js';
import * as dat from 'dat.gui';
import nebula from '../img/nebula-left.jpeg';
import world from '../img/world_left.jpeg';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
//this is how we import or 3d model file
const blobUrl = new URL('../assets/monkey.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

//shadows are off by default, this allows us to render a shadow
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10,30,30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x0FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
//we need to specify weather an object recieves or casts a shadow. In this scenario we want the plane to recieve the shadow.
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30 );
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0X0000FF,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 10, 0);
scene.add(sphere);
//we must specify the object that is casting the shadow
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);


/***** snippet is for creating directional light  ***************
 * const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
 * scene.add(directionalLight);
 * directionalLight.position.set(-30, 50, 0);
 * //we must specify the object that is casting the shadow
 * directionalLight.castShadow = true;
 * //this line shifts the camera/angle line further down so that it captures the full shadow (shown by orange lines)
 * directionalLight.shadow.camera.bottom = -12;
 *
 * //the Helper method allows indicates the diretion of the light in the dom
 * const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
 * scene.add(dLightHelper);
 * //Helper method indicates where the camera is capturing the shadow (orange lines)
 * const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
 * scene.add(dLightShadowHelper); 
 * 
 * 
 */

 const spotLight = new THREE.SpotLight(0xFFFFFF);
 scene.add(spotLight);
 spotLight.position.set(-100, 100, 0);
 spotLight.castShadow = true;

 const spotLightHelper = new THREE.SpotLightHelper(spotLight);
 scene.add(spotLightHelper); 
 spotLight.angle = 0.2;

 scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);

//renderer.setClearColor(0xFFEA00);

const textureLoader = new THREE.TextureLoader();
//this loads background images flat (2d)
//scene.background = textureLoader.load(nebula);
//this loads background images with 6 sides making it appear 3d
const cubeTextureLoader = new THREE.CubeTextureLoader();

// scene.background = cubeTextureLoader.load([
//     world,
//     world,
//     world,
//     nebula,
//     nebula,
//     nebula
// ]);

//adding texture to a cube:
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
    color: 0x00FF00,
    map: textureLoader.load(nebula)
});

//loading texture to each face of cube:
// const box2MultiMaterial = [
//     new THREE.MeshBasicMaterial({map: textureLoader.load(world)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(world)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(world)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)})
// ]
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);

//alternative method for loading material to box:
//box2.material.map = textureLoader.load(nebula);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFF,
    wireframe: true
});

const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometry = new THREE.SphereGeometry(4);

const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

const fShader = `
        void main() {
            gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
        }`;
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader
});

const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetLoader = new GLTFLoader();

assetLoader.load(blobUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 4, 10);
}, undefined, function(error) {
    console.log(error);
}); 

//this adds a gui to screen to adjust material color, wireframe on/off...
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0; 

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / this.window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';

function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
//this allows us to control the bounce speed of the sphere
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for(let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.id === sphereId) {
            intersects[i].object.material.color.set(0xFF0000);
        }

        if(intersects[i].object.name === 'theBox') {
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }
    }

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
});