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
const story = { progress: 0 };
const floorFocus = { x: 3, z: -1 };
const floorUniforms = { focus: { value: new THREE.Vector2(3, -1) }, strength: { value: .045 } };
let renderer, pizza, mm, tour, disposed = false, dirty = true, renderedProgress = -1;
let sceneVisible = true, focusX, focusZ, sceneObserver;
let width = 0, height = 0, mobile = false;
let lastFrame = 0, intervalCount = 0;
const frameIntervals = [], renderTimes = [];
const diagnostics = { ready: false, frames: 0, modelBytes: 0, triangles: 0, dpr: 0,
  orbitDegrees: 0, progress: 0, storyProgress: 0, storyPhase: 'intro', cameraHolding: true,
  backgroundInteractive: false, drawCalls: 0, contextLost: false };
const target = new THREE.Vector3();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .05, 80);
const clock = { lastDiagnostic: 0 };
const path = [
  // progress, orbital angle, elevation, distance, view-centre offset, aim height
  [0, 20, 38, 11.2, 1.65, .3],
  [.28, 76, 48, 10.2, 1.7, .3],
  [.66, 152, 62, 9.7, 1.9, .3],
  [1, 220, 54, 4.8, .0, .25],
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
    distance += (fitDistance - path[0][3]) * (1 - smooth(Math.min(p / .85, 1)));
  }
  camera.position.set(Math.sin(azimuth) * Math.cos(polar) * distance,
                      Math.sin(polar) * distance + .2,
                      Math.cos(azimuth) * Math.cos(polar) * distance);
  const sideOffset = mobile ? 0 : offset;
  target.set(-Math.cos(azimuth) * sideOffset,
             mobile ? aimHeight + 3.0 * (1 - smooth(Math.min(p / .95, 1))) : aimHeight,
             Math.sin(azimuth) * sideOffset);
  camera.lookAt(target);
  diagnostics.orbitDegrees = +(degrees - path[0][1]).toFixed(2);
  diagnostics.progress = +p.toFixed(4);
}

function markDirty() { dirty = true; }
function draw() {
  if (disposed || !diagnostics.ready || !dirty || document.hidden || !sceneVisible) return;
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
  const result = { ...diagnostics, width, height, floorFocus: { x: +floorFocus.x.toFixed(2), z: +floorFocus.z.toFixed(2) }, intervalSamples: intervalCount,
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
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-ready');
  mm = gsap.matchMedia();
  mm.add({ reduce: '(prefers-reduced-motion: reduce)', normal: '(prefers-reduced-motion: no-preference)' }, context => {
    document.body.classList.toggle('reduced-motion', context.conditions.reduce);
    if (context.conditions.reduce) {
      motion.progress = 0;
      markDirty();
      return;
    }
    const copies = ['intro', 'crust', 'ingredients', 'close'];
    const elements = [document.querySelector('.intro'), document.querySelector('#crust-copy'),
      document.querySelector('#ingredients-copy'), document.querySelector('#closer-copy')];
    let activePhase;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#journey', start: 'top top', end: 'bottom bottom',
        scrub: .35, invalidateOnRefresh: true, id: 'pizza-camera', onScrubComplete: publishDiagnostics },
      onUpdate() {
        const t = this.time();
        const phase = t < 1.25 ? 'intro' : t >= 3 && t < 4.9 ? 'crust' :
          t >= 7 && t < 9 ? 'ingredients' : t >= 10.9 ? 'close' : 'flight';
        if (phase !== activePhase) {
          elements.forEach((element, i) => element.classList.toggle('is-visible', copies[i] === phase));
          document.body.classList.toggle('scene-close', phase === 'close');
          document.body.classList.toggle('scene-ingredients', phase === 'ingredients');
          activePhase = phase;
        }
        diagnostics.storyPhase = phase;
        diagnostics.storyProgress = +story.progress.toFixed(4);
        diagnostics.cameraHolding = t <= 1.1 || (t >= 3.1 && t <= 4.8) || (t >= 7.1 && t <= 8.9) || t >= 11.15;
        progressBar.style.transform = `scaleX(${story.progress})`;
        if (Math.abs(motion.progress - renderedProgress) > .00001) markDirty();
        if (performance.now() - clock.lastDiagnostic > 250) { clock.lastDiagnostic = performance.now(); publishDiagnostics(); }
      },
    });
    tl.to(story, { progress: 1, duration: 13, ease: 'none' }, 0);
    tl.to('.intro', { autoAlpha: 0, y: '-=24', duration: .4, ease: 'power2.in' }, .85);
    tl.to(motion, { progress: .28, duration: 2, ease: 'power2.inOut' }, 1.1);
    tl.to(motion, { progress: .66, duration: 2.3, ease: 'power2.inOut' }, 4.8);
    tl.to(motion, { progress: 1, duration: 2.25, ease: 'power2.inOut' }, 8.9);
    for (const [element, at, out] of [[elements[1], 3, 4.55], [elements[2], 7, 8.65], [elements[3], 10.9, null]]) {
      tl.to(element, { autoAlpha: 1, duration: .15 }, at);
      tl.fromTo(element.querySelectorAll('.text-line > span'), { yPercent: 105 },
        { yPercent: 0, duration: .65, stagger: .08, ease: 'power4.out' }, at);
      tl.fromTo(element.querySelectorAll('p, a'), { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .5, stagger: .05, ease: 'power2.out' }, at + .3);
      if (out !== null) tl.to(element, { autoAlpha: 0, duration: .35, ease: 'power2.in' }, out);
    }
    return () => { tl.kill(); document.body.classList.remove('scene-close', 'scene-ingredients'); motion.progress = 0; story.progress = 0; markDirty(); };
  });
  gsap.ticker.add(draw);
  ScrollTrigger.refresh();
  playButton.disabled = false;
  const cancelTour = () => { tour?.kill(); playButton.querySelector('span').textContent = 'Смотреть историю'; };
  playButton.addEventListener('click', () => {
    if (tour?.isActive()) { cancelTour(); return; }
    let start = window.scrollY;
    const end = document.querySelector('#journey').offsetHeight - height;
    if (end <= 0) return;
    if (start >= end - 2) { start = 0; window.scrollTo({ top: 0, behavior: 'instant' }); }
    const cursor = { y: start };
    playButton.querySelector('span').textContent = 'Остановить';
    tour = gsap.to(cursor, { y: end, duration: Math.max(3, 20 * (1 - start / end)), ease: 'none',
      onUpdate: () => window.scrollTo({ top: cursor.y, behavior: 'instant' }),
      onComplete: () => { playButton.querySelector('span').textContent = 'Смотреть историю'; publishDiagnostics(); },
    });
  });
  window.addEventListener('wheel', cancelTour, { passive: true });
  window.addEventListener('touchstart', cancelTour, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelTour(); });
  window.addEventListener('keydown', event => {
    if (['Escape','PageDown','PageUp','Home','End','ArrowDown','ArrowUp',' '].includes(event.key)) cancelTour();
  });
  document.querySelector('#replay').addEventListener('click', () => {
    cancelTour();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
}

function setupBackground() {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const table = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const capability = matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const update = () => { floorUniforms.focus.value.set(floorFocus.x, floorFocus.z); markDirty(); };
  if (gsap) {
    focusX = gsap.quickTo(floorFocus, 'x', { duration: .7, ease: 'power2.out', onUpdate: update, onComplete: publishDiagnostics });
    focusZ = gsap.quickTo(floorFocus, 'z', { duration: .7, ease: 'power2.out', onUpdate: update, onComplete: publishDiagnostics });
  }
  const sync = () => {
    diagnostics.backgroundInteractive = capability.matches && !mobile;
    if (!diagnostics.backgroundInteractive) { focusX?.tween.pause(); focusZ?.tween.pause(); floorFocus.x = 3; floorFocus.z = -1; update(); }
    publishDiagnostics();
  };
  sync();
  capability.addEventListener('change', sync);
  window.addEventListener('resize', sync, { passive: true });
  stage.addEventListener('pointermove', event => {
    if (!diagnostics.backgroundInteractive || !sceneVisible || !focusX) return;
    const rect = stage.getBoundingClientRect();
    mouse.set((event.clientX - rect.left) / width * 2 - 1, -(event.clientY - rect.top) / height * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(table, hit)) {
      focusX(THREE.MathUtils.clamp(hit.x, -12, 12));
      focusZ(THREE.MathUtils.clamp(hit.z, -12, 12));
    }
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { if (focusX) { focusX(3); focusZ(-1); } });
  sceneObserver = new IntersectionObserver(entries => {
    sceneVisible = entries[0].isIntersecting;
    if (sceneVisible) markDirty();
  });
  sceneObserver.observe(stage);
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
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x171716, roughness: 1, metalness: 0 });
    floorMaterial.onBeforeCompile = shader => {
      shader.uniforms.uFaroFocus = floorUniforms.focus;
      shader.uniforms.uFaroStrength = floorUniforms.strength;
      shader.vertexShader = 'varying vec3 vFaroWorld;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <worldpos_vertex>',
        '#include <worldpos_vertex>\nvFaroWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = 'uniform vec2 uFaroFocus;\nuniform float uFaroStrength;\nvarying vec3 vFaroWorld;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>',
        'vec2 faroDelta = vFaroWorld.xz - uFaroFocus;\noutgoingLight += exp(-dot(faroDelta, faroDelta) / 14.0) * uFaroStrength * vec3(1.0, 0.67, 0.42);\n#include <opaque_fragment>');
    };
    floorMaterial.customProgramCacheKey = () => 'faro-floor-focus-v1';
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(150,150), floorMaterial);
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
    document.querySelector('#loader').setAttribute('aria-hidden', 'true');
    setupAnimation();
    // Update dimensions before the background's capability listener reads them.
    window.addEventListener('resize', resize, { passive: true });
    setupBackground();
    draw();
    publishDiagnostics();
    document.addEventListener('visibilitychange', markDirty);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault(); diagnostics.contextLost = true;
      diagnostics.ready = false; mm?.revert(); tour?.kill(); document.body.classList.remove('motion-ready');
      document.body.classList.add('scene-unavailable');
      document.querySelector('#error').hidden = false;
    });
    canvas.addEventListener('webglcontextrestored', () => location.reload());
  } catch (error) {
    console.error('Pizza scene failed:', error);
    document.body.classList.add('ready', 'scene-unavailable');
    document.querySelector('#error').hidden = false;
    document.querySelector('#loader').hidden = true;
  }
}

window.addEventListener('pagehide', event => {
  // A browser-cached page will resume with its same renderer on back navigation.
  if (event.persisted) return;
  disposed = true; tour?.kill(); mm?.revert(); sceneObserver?.disconnect(); gsap?.ticker.remove(draw);
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
