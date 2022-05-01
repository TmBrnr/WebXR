import * as THREE from '../../libs/three/three.module.js';

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} = THREE;

function createWebGlContext(glAttribs) {
  const webGlCanvas = document.createElement("canvas");
  const context = webGlCanvas.getContext("webgl2", glAttribs);
  return context;
}

function makeCube() {
  const geometry = new BoxGeometry(1,1,1);
  const material = new MeshBasicMaterial({color:"blue"});
  const cube = new Mesh(geometry, material);
  return cube;
}

function makeOutputCanvas() {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.height = window.innerHeight;
  outputCanvas.width = window.innerWidth;
  const outputContext = outputCanvas.getContext("xrpresent");
  return {outputCanvas, outputContext};
}

function createThreeScene(webGlContext) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer({
    context: webGlContext
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const cube = makeCube();
  scene.add(cube);
  
  function renderScene(delta) {
    renderer.render(scene, camera);
  }
  
  return {
    scene, camera, renderer, renderScene };
}

const globalShared = {
  getRefFrameFor(session) {
    return session.exclusive
        ? this.exclusiveRefFrame
        : this.nonExclusiveRefFrame;
  }
};
function ensureShared(session) {
  const shared = globalShared;
  
  if (!shared.initialized) {
    shared.webGlContext = createWebGlContext({
      compatibleXRDevice: session.device
    });
  
    const {
      scene, camera, renderer, renderScene
    } = createThreeScene(shared.webGlContext);
    
    shared.scene = scene;
    shared.camera = camera;
    shared.renderer = renderer;
    shared.renderScene = renderScene;
    
    shared.initialized = true;
  }
  
  return shared;
}

function onSessionStarted(session) {
  const shared = ensureShared(session);
  const { webGlContext } = shared;
  
  session.baseLayer = new XRWebGLLayer(session, webGlContext);
  
  return session.requestFrameOfReference("eyeLevel").then(refFrame => {
    // Share the reference frame.
    // Depending on whether or not the session is a magic window,
    // store the reference frame in different locations.
    if (session.exclusive) {
      shared.exclusiveRefFrame = refFrame;
    } else {
      shared.nonExclusiveRefFrame = refFrame;
    }

    session.requestAnimationFrame(onXrFrame);
  });
}

function onXrFrame(delta, frame) {
  const session = frame.session;

  const shared = ensureShared();
  const refFrame = shared.getRefFrameFor(session);
  const {
    renderScene,
  } = shared;
  
  renderScene(delta);
  session.requestAnimationFrame(onXrFrame);
}

function run() {
  initXr().catch(err => {
    document.write(JSON.stringify({
      name: err.name,
      message: err.message,
      fileName: err.fileName,
      lineNumber: err.lineNumber,
      columnNumber: err.columnNumber,
    }));
    console.error(err);
  });
}

//run();

document.querySelector(".enter-xr").addEventListener("click", event => {
  navigator.xr.requestDevice()
    .then(device => device.requestSession({ exclusive:true }))
    .then(session => onSessionStarted(session));
  
  //run();
});



function testScene() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer();
  const canvas = renderer.domElement;
  document.body.appendChild(canvas);
  
  camera.position.z += 5;
  camera.position.y += 2;
  camera.position.x += 1;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  const cube = makeCube();
  scene.add(cube);
  
  function renderScene(delta) {
    renderer.render(scene, camera);
  }
  
  renderScene();
}

//testScene();
