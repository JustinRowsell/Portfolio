import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({
//   color: 0xFF6347,
// });
// const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement)

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const star = new THREE.Mesh(geometry, material);

  const [ x, y, z ] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const normalTexture = new THREE.TextureLoader().load('earth_normal_map.tif');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);

// earth.position.z = 30;
// earth.position.setX(-10);

scene.add(earth);

function moveCamera() {
  const top = document.body.getBoundingClientRect().top;
  // earth.rotation.x += 0.05;
  earth.rotation.y += 0.05;
  // earth.rotation.z += 0.05;

  camera.position.z = top * -0.01;
  camera.position.x = top * -0.0002;
  camera.position.y = top * -0.0002;
}
document.body.onscroll = moveCamera;

Array(100).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


let rickAndMortyScene;
let flyX = 0;
let flyY = 0;
let directionDuration = 100;
let moveSpeed = 0.01;
function animate() {
  requestAnimationFrame( animate );
  if (rickAndMortyScene) {
    let range = 2;
    let halfRange = range / 2;
    if (flyX == 0 && flyY == 0) {
      let randXY = THREE.MathUtils.randFloat(0, range);
      let randPosNeg = THREE.MathUtils.randFloat(0, range);
      
      if (randPosNeg > halfRange)
        moveSpeed = moveSpeed * -1;

      if (randXY < halfRange) {
        flyX = directionDuration;
      } else {
        flyY = directionDuration;
      }
    } else if (flyX > 0) {
      let currX = rickAndMortyScene.position.x; 
      rickAndMortyScene.position.setX(currX + moveSpeed);
      flyX -= 1;
    } else {
      let currY = rickAndMortyScene.position.y;
      rickAndMortyScene.position.setY(currY + moveSpeed);
      flyY -= 1;
    }
  }
  
  controls.update();

  renderer.render(scene, camera);
}

// load rick and morty
const loader = new GLTFLoader();
// Load a glTF resource
loader.load(
	// resource URL
	'models/RickAndMorty/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
    const scale = 0.1;
    rickAndMortyScene = gltf.scene;
    rickAndMortyScene.children.forEach((mesh) => mesh.scale.set(scale, scale, scale));
    rickAndMortyScene.position.setX(-5);
    rickAndMortyScene.position.setY(-5);
    rickAndMortyScene.position.setZ(40);
    
    scene.add(rickAndMortyScene);
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    animate();
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened...' );
    console.log(error);
	}
);