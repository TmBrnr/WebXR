class Cradle extends THREE.Object3D {
  
  
  update() {
  this.balls[0].rotation.x = Math.max(0,Math.sin(Date.now()/100));

  this.balls[this.balls.length-1].rotation.x = Math.min(0,Math.sin(Date.now()/100));

  }
  constructor() {
    super();
    
let tex = new THREE.CubeTextureLoader()
.setPath("https://threejs.org/examples/textures/cube/Bridge2/")
.setCrossOrigin("Anonymous")
.load("xxyyzz"
  .split("")
  .map((e,i)=>(i%2==0?"pos":"neg")+e+".jpg"));


                  
let sphereGeo = new THREE.SphereBufferGeometry(.5, 18,18);

let tl = new THREE.TextureLoader()
  .setCrossOrigin("Anonymous")
  .setPath("https://threejs.org/examples/textures/")

let wood = new THREE.MeshPhongMaterial({
  bumpMap:tl.load("hardwood2_bump.jpg"),
  bumpScale:0.01,
  map:tl.load("hardwood2_diffuse.jpg"),
});

let metal = new THREE.MeshPhongMaterial({
  envMap:tex,
  emissive:0x808080
});


const wireLength = 2.5;
let stringGeo = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.01,0.01, wireLength, 12), metal);


tex.needsUpdate = true;
this.balls =[];
for(var i =0;i<count;i++) {
  let segment = new THREE.Object3D();
  this.add(segment);
  segment.position.set(0,4, i-count/2);

  let ball = new THREE.Mesh(sphereGeo,metal);
  let pivot = new THREE.Object3D();
  segment.add(ball);
  
  ball.add(pivot);
  pivot.rotation.z = Math.PI/7;
  let wire1 = stringGeo.clone();
  wire1.position.y=wireLength/2.4;
  pivot.add(wire1);

   pivot = new THREE.Object3D();
  ball.add(pivot);
  pivot.rotation.z = -Math.PI/7;
   wire1 = stringGeo.clone();
  wire1.position.y=wireLength/2.4;
  pivot.add(wire1);
 this.balls.push(segment);
  ball.position.y = -2;
}

var geo = new THREE.Geometry();
geo.vertices = [
  new THREE.Vector3(-0,0,-.5),
  new THREE.Vector3(-.5,0,-.5),
  new THREE.Vector3(.5,0,-.5),
  new THREE.Vector3(.5,1,-.5),
  new THREE.Vector3(.5,1,.5),
  new THREE.Vector3(.5,0,.5),
  new THREE.Vector3(-.5,0,.5),
  new THREE.Vector3(-.5,1,.5),
  new THREE.Vector3(-.5,1,-.5),
  new THREE.Vector3(-.5,0,-.5),
].map(e=>{
  e.x*=2;
  e.y*=4;
  e.z*=6;
  return e;
}).reduce((o,v,i,a)=>{
  const next = a[(i+1)%a.length];
  const prev = a[(i-1+a.length)%a.length];
  o.push( v.clone().lerp(prev,0.1),
      v.clone(),
      v.clone().lerp(next,0.1));
  return o;
},[]);

var curve = new THREE.CatmullRomCurve3(geo.vertices);

var tGeo = new THREE.TubeGeometry(curve,400,.1);
let tube = new THREE.Mesh(tGeo,metal);
tube.position.z = -0.5;
tube.position.y = 0.1;
this.add(tube);

geo.vertices = curve.getPoints(100);    



let cyl = new THREE.Mesh(new THREE.CylinderBufferGeometry(4.9,5,.1,32), wood);
this.add(cyl);
cyl.position.y = -0.05;
 cyl = new THREE.Mesh(new THREE.CylinderBufferGeometry(5,5,.1,32), wood);
this.add(cyl);
cyl.position.y = -0.15;
   
  }
  
}


class App {
    constructor() {
        this.initThree();

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshStandardMaterial({roughness:0.6}));
      this.scene.add(floor);
      floor.rotation.x = -Math.PI/2;
      const grid = new THREE.GridHelper(20,20);
      this.scene.add(grid);
      grid.position.y = 0.04;
      const column = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.23,0.13, 1, 50, 12), new THREE.MeshStandardMaterial({roughness:0.7}));
      column.position.y = 0.5;
      this.scene.add(column);
      this.sun = new THREE.PointLight(0xe0e0d0,0.5);
        this.sun.position.set(0,1,2);
        this.scene.add(this.sun);

            this.sun = new THREE.PointLight(0xf0e0a0,0.5);
        this.sun.position.set(1,1.8,-2);
        this.scene.add(this.sun);

      
    }

    
  initThree() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x406060,0.2);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x406060);
        this.camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.05, 100);
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setAnimationLoop(e => this.update(e));
        this.VR = location.href.toLowerCase().indexOf('vr')>-1;
        this.viewCaster = new THREE.Raycaster();
        let btn;
        try {
            this.renderer.vr.enabled = true;
              btn = THREE.WEBVR.createButton( this.renderer );
            document.body.appendChild( btn );
            var poll = setInterval(()=>{
                console.log(btn.innerText)
                if(
                  
                    btn.innerText.indexOf("NOT")>-1
                ) {
                    clearInterval(poll);
                    this.renderer.vr.enabled = false;
                    this.camera.position.z = 2;
                    this.camera.position.y = 1;
                    this.controls.update();
                }
            }, 16);
        } catch(err) {}
            this.camera.position.set(0,1,2);
            this.camera.lookAt(new THREE.Vector3(0,0.5,0));
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.target.y = 0.5;            
            this.controls.update();
    }
    update() {
        this.renderer.render(this.scene, this.camera);
      cradle.update();
    }
}




const count = 6;

let autoRotate = true;
window.addEventListener('mousedown', e=>{
  autoRotate = false;
});

const app = new App();

const cradle = new Cradle();
cradle.scale.setScalar(0.04);
cradle.position.y = 1.007;
app.scene.add(cradle)
