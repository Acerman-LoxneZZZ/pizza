import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.querySelector('#pizza-canvas');
const stage = document.querySelector('#stage');
const loaderBar = document.querySelector('.loading-line i');
const playButton = document.querySelector('#play-tour');
const progressBar = document.querySelector('.progress span');
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const motion = { progress: 0 };
let renderer, pizza, mm, tour, disposed = false, dirty = true, renderedProgress = -1;
let width = 0, height = 0, mobile = false;
let lastFrame = 0, intervalCount = 0;
const frameIntervals = [], renderTimes = [];
const diagnostics = { ready: false, frames: 0, modelBytes: 0, triangles: 0, dpr: 0,
  orbitDegrees: 0, progress: 0, drawCalls: 0, contextLost: false };
const target = new THREE.Vector3();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .05, 80);
const clock = { lastDiagnostic: 0 };
const path = [
  // progress, orbital angle, elevation, distance, view-centre offset, aim height
  [0, 20, 38, 11.2, 1.65, .3],
  [.32, 84, 46, 8.6, .25, .3],
  [.65, 150, 62, 6.3, .0, .3],
  [1, 220, 54, 4.5, .0, .25],
];

function smooth(t) { return t*t*(3-2*t); }
function pathAt(progress) {
  let i = 0;
  while (i < path.length - 2 && progress > path[i + 1][0]) i++;
  const a = path[i], b = path[i + 1];
  const u = THREE.MathUtils.clamp((progress - a[0]) / (b[0] - a[0]), 0, 1);
  // Monotonic angular speed; smooth distance/elevation with zero velocity at
  // segment boundaries. One object and one camera, no image swaps.
  const angle = path[0][1] + 200 * progress;
  return [angle, ...a.slice(2).map((v, n) => THREE.MathUtils.lerp(v, b[n + 2], smooth(u)))];
}

function applyCamera() {
  const p = THREE.MathUtils.clamp(motion.progress, 0, 1);
  const [degrees, elevation, baseDistance, offset, aimHeight] = pathAt(p);
  const azimuth = THREE.MathUtils.degToRad(degrees);
  const polar = THREE.MathUtils.degToRad(elevation);
  let distance = baseDistance;
  if (mobile) {
    const fitDistance = 7.5 / (2 * Math.tan(THREE.MathUtils.degToRad(17)) * camera.aspect);
    distance += (fitDistance - path[0][3]) * (1 - smooth(Math.min(p / .55, 1)));
  }
  camera.position.set(Math.sin(azimuth) * Math.cos(polar) * distance,
                      Math.sin(polar) * distance + .2,
                      Math.cos(azimuth) * Math.cos(polar) * distance);
  const sideOffset = mobile ? 0 : offset;
  target.set(-Math.cos(azimuth) * sideOffset,
             mobile ? aimHeight + 3.0 * (1 - smooth(Math.min(p / .45, 1))) : aimHeight,
             Math.sin(azimuth) * sideOffset);
  camera.lookAt(target);
  diagnostics.orbitDegrees = +(degrees - path[0][1]).toFixed(2);
  diagnostics.progress = +p.toFixed(4);
}

function markDirty() { dirty = true; }
function draw() {
  if (disposed || !diagnostics.ready || !dirty || document.hidden) return;
  dirty = false;
  const now = performance.now();
  applyCamera();
  const start = performance.now();
  renderer.render(scene, camera);
  renderTimes.push(performance.now() - start);
  if (renderTimes.length > 900) renderTimes.shift();
  const moved = Math.abs(motion.progress - renderedProgress) > .00001;
  if (lastFrame && moved && now - lastFrame < 100) {
    frameIntervals.push(now - lastFrame);
    if (frameIntervals.length > 900) frameIntervals.shift();
    intervalCount++;
  }
  lastFrame = moved ? now : 0;
  renderedProgress = motion.progress;
  diagnostics.frames++;
  diagnostics.triangles = renderer.info.render.triangles;
  diagnostics.drawCalls = renderer.info.render.calls;
  progressBar.style.transform = `scaleX(${motion.progress})`;
  if (now - clock.lastDiagnostic > 250) {
    clock.lastDiagnostic = now;
    publishDiagnostics();
  }
}

function percentile(values, fraction) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a,b) => a-b);
  return +sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))].toFixed(2);
}
function publishDiagnostics() {
  const result = { ...diagnostics, width, height, intervalSamples: intervalCount,
    frameMedianMs: percentile(frameIntervals, .5), frameP95Ms: percentile(frameIntervals, .95),
    renderMedianMs: percentile(renderTimes, .5), renderP95Ms: percentile(renderTimes, .95),
    geometryCount: renderer.info.memory.geometries, textureCount: renderer.info.memory.textures };
  canvas.dataset.diagnostics = JSON.stringify(result);
}

function resize() {
  width = stage.clientWidth;
  height = stage.clientHeight;
  mobile = width < 700;
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2, Math.sqrt(4300000 / (width*height)));
  renderer.setPixelRatio(Math.max(1, dpr));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  diagnostics.dpr = +renderer.getPixelRatio().toFixed(2);
  markDirty();
}

function setupAnimation() {
  gsap.registerPlugin(ScrollTrigger);
  mm = gsap.matchMedia();
  mm.add({ reduce: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' }, context => {
    if (context.conditions.reduce) {
      motion.progress = 0;
      markDirty();
      return;
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#journey', start: 'top top', end: 'bottom bottom',
        scrub: .5, invalidateOnRefresh: true, id: 'pizza-camera', onScrubComplete: publishDiagnostics },
      onUpdate: markDirty,
    });
    tl.to(motion, { progress: 1, ease: 'none', duration: 1 }, 0);
    tl.to('.intro', { autoAlpha: 0, x: -32, ease: 'none', duration: .15 }, .025);
    return () => { tl.kill(); motion.progress = 0; markDirty(); };
  });
  gsap.ticker.add(draw);
  playButton.disabled = false;
  playButton.addEventListener('click', () => {
    if (tour?.isActive()) { tour.kill(); playButton.querySelector('span').textContent = 'Смотреть пролёт'; return; }
    const start = window.scrollY;
    const end = document.querySelector('#journey').offsetHeight - height;
    const cursor = { y: start };
    playButton.querySelector('span').textContent = 'Остановить';
    tour = gsap.to(cursor, { y: end, duration: Math.max(3, 14 * (1 - start / end)), ease: 'none',
      onUpdate: () => window.scrollTo(0, cursor.y),
      onComplete: () => { playButton.querySelector('span').textContent = 'Смотреть пролёт'; publishDiagnostics(); },
    });
  });
  const cancelTour = () => { tour?.kill(); playButton.querySelector('span').textContent = 'Смотреть пролёт'; };
  window.addEventListener('wheel', cancelTour, { passive: true });
  window.addEventListener('touchstart', cancelTour, { passive: true });
  window.addEventListener('keydown', event => {
    if (['Escape','PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(event.key)) cancelTour();
  });
  document.querySelector('#replay').addEventListener('click', () => {
    cancelTour();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}

async function init() {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .86;
    resize();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment();
    const envTarget = pmrem.fromScene(environment, .04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = .4;
    environment.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfff1dd, 0x30302d, .7));
    const key = new THREE.DirectionalLight(0xffedcd, 2);
    key.position.set(-4, 7, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe0e6df, .7);
    rim.position.set(3, 5, -5);
    scene.add(rim);
    const gltf = await new GLTFLoader().loadAsync('pizza.glb', event => {
      if (event.total) { diagnostics.modelBytes = event.total; loaderBar.style.transform = `scaleX(${.1 + .8 * event.loaded / event.total})`; }
    });
    pizza = gltf.scene;
    pizza.traverse(object => {
      if (!object.isMesh) return;
      object.frustumCulled = false;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        material.side = THREE.FrontSide;
        material.metalness = 0;
        material.envMapIntensity = .7;
        material.roughness = .85;
        for (const property of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) {
          if (material[property]) material[property].anisotropy = Math.min(mobile ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
        }
      }
    });
    scene.add(pizza);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150,150), new THREE.MeshStandardMaterial({ color: 0x171716, roughness: 1, metalness: 0 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.012;
    scene.add(floor);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(128,128,0,128,128,128);
    gradient.addColorStop(0, 'rgba(0,0,0,.9)');
    gradient.addColorStop(.65, 'rgba(0,0,0,.65)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0,0,256,256);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(7.6,7.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
    contact.rotation.x = -Math.PI/2;
    contact.position.y = -.005;
    scene.add(contact);
    applyCamera();
    await renderer.compileAsync(scene, camera);
    renderer.render(scene, camera);
    loaderBar.style.transform = 'scaleX(1)';
    diagnostics.ready = true;
    document.body.classList.add('ready');
    setupAnimation();
    draw();
    publishDiagnostics();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', markDirty);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); diagnostics.contextLost = true;
      document.querySelector('#error').hidden = false;
    });
    canvas.addEventListener('webglcontextrestored', () => location.reload());
  } catch (error) {
    console.error('Pizza scene failed:', error);
    document.querySelector('#error').hidden = false;
    document.querySelector('#loader').hidden = true;
  }
}

window.addEventListener('pagehide', event => {
  // A browser-cached page will resume with its same renderer on back navigation.
  if (event.persisted) return;
  disposed = true; tour?.kill(); mm?.revert(); gsap?.ticker.remove(draw);
  const geometries = new Set(), materials = new Set(), textures = new Set();
  scene.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    const list = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
    for (const material of list) {
      materials.add(material);
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    }
  });
  textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose());
  geometries.forEach(geometry => geometry.dispose()); scene.environment?.dispose(); renderer?.dispose();
});
init();
