import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/FilmPass.js";

// Three.js 粒子树 / 蛋糕场景
const palette = ["#f7e7ce", "#ffb7c5", "#ffffff", "#ffd700"];
const canvas = document.getElementById("luxCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.3, 6);

const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const keyLight = new THREE.DirectionalLight(0xfff1d9, 1.2);
keyLight.position.set(5, 8, 10);
scene.add(keyLight);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.1, 0.4, 0.85);
composer.addPass(bloomPass);
composer.addPass(new FilmPass(0.25, 0.5, 648, false));

const particleCount = 1600;
const particleData = [];
const shapeChoices = ["diamond", "cube", "triangle", "sphere"];
const shapeCounts = Object.fromEntries(shapeChoices.map(shape => [shape, 0]));

for (let i = 0; i < particleCount; i++) {
    const shape = shapeChoices[Math.floor(Math.random() * shapeChoices.length)];
    shapeCounts[shape] += 1;
    particleData.push({ shape });
}

const geometries = {
    diamond: new THREE.OctahedronGeometry(0.13, 0),
    cube: new THREE.BoxGeometry(0.14, 0.14, 0.14),
    triangle: new THREE.ConeGeometry(0.12, 0.24, 3),
    sphere: new THREE.IcosahedronGeometry(0.11, 0)
};

const materials = shapeChoices.reduce((acc, shape) => {
    acc[shape] = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0xffffff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.95
    });
    return acc;
}, {});

const meshes = {};
const shapeOffsets = {};
shapeChoices.forEach(shape => {
    meshes[shape] = new THREE.InstancedMesh(geometries[shape], materials[shape], Math.max(shapeCounts[shape], 1));
    meshes[shape].instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(meshes[shape]);
    shapeOffsets[shape] = 0;
});

// Add gold sparkle particles
const sparkleCount = 200;
const sparkleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
const sparkleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const sparkleMesh = new THREE.InstancedMesh(sparkleGeometry, sparkleMaterial, sparkleCount);
sparkleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(sparkleMesh);

const sparkleData = [];
for (let i = 0; i < sparkleCount; i++) {
    sparkleData.push({
        position: new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        ),
        phase: Math.random() * Math.PI * 2
    });
}

const cakeTargets = generateCakePositions(particleCount);
const treeTargets = generateTreePositions(particleCount);

particleData.forEach((item, index) => {
    const shape = item.shape;
    const meshIndex = shapeOffsets[shape]++;
    item.mesh = meshes[shape];
    item.meshIndex = meshIndex;
    item.current = new THREE.Vector3().copy(treeTargets[index]).multiplyScalar(1.4);
    item.velocity = THREE.MathUtils.randFloat(0.08, 0.18);
    item.glowPhase = Math.random() * Math.PI * 2;
    item.scale = THREE.MathUtils.randFloat(0.6, 1.4);
    const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
    item.mesh.setColorAt(meshIndex, color);
    item.color = color;
});

Object.values(meshes).forEach(mesh => {
    if (mesh.count > 0 && mesh.instanceColor) {
        mesh.instanceColor.needsUpdate = true;
    }
});

// Initialize sparkle positions
{
    const dummy = new THREE.Object3D();
    sparkleData.forEach((sparkle, index) => {
        dummy.position.copy(sparkle.position);
        dummy.updateMatrix();
        sparkleMesh.setMatrixAt(index, dummy.matrix);
    });
    sparkleMesh.instanceMatrix.needsUpdate = true;
}

function generateCakePositions(count) {
    const result = [];
    const layers = [
        { radius: 1.4, y: -0.55, height: 0.3 },
        { radius: 1.05, y: -0.15, height: 0.26 },
        { radius: 0.7, y: 0.18, height: 0.22 }
    ];
    while (result.length < count) {
        for (const layer of layers) {
            if (result.length >= count) break;
            const angle = Math.random() * Math.PI * 2;
            const r = layer.radius * Math.sqrt(Math.random());
            const y = layer.y + Math.random() * layer.height;
            const x = r * Math.cos(angle);
            const z = r * Math.sin(angle);
            result.push(new THREE.Vector3(x, y, z));
        }
    }
    const candles = Math.floor(count * 0.05);
    for (let i = 0; i < candles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.15 + Math.random() * 0.15;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = 0.55 + Math.random() * 0.2;
        result[i] = new THREE.Vector3(x, y, z);
    }
    return result;
}

function generateTreePositions(count) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const t = i / count;
        const height = -0.85 + t * 1.9;
        const radius = (1.5 * (1 - t)) + Math.sin(t * 12) * 0.05;
        const angle = t * Math.PI * 24 + Math.random() * 0.4;
        const jitter = THREE.MathUtils.randFloatSpread(0.08);
        const x = (radius + jitter) * Math.cos(angle);
        const z = (radius + jitter) * Math.sin(angle);
        const wobbleY = height + Math.sin(angle * 0.5) * 0.03;
        result.push(new THREE.Vector3(x, wobbleY, z));
    }
    return result;
}

function updateParticles(delta, elapsed) {
    const targets = treeTargets;
    const dummy = new THREE.Object3D();
    particleData.forEach((item, index) => {
        const target = targets[index];
        item.current.lerp(target, item.velocity * delta * 60);
        const scale = item.scale;
        dummy.position.copy(item.current.multiplyScalar(1.65));
        dummy.rotation.set(0.2 + Math.sin(elapsed + item.glowPhase) * 0.2, elapsed * 0.25, 0);
        dummy.scale.setScalar(scale * (1.1 + Math.sin(elapsed + item.glowPhase) * 0.08));
        dummy.updateMatrix();
        item.mesh.setMatrixAt(item.meshIndex, dummy.matrix);
    });
    Object.values(meshes).forEach(mesh => {
        mesh.instanceMatrix.needsUpdate = true;
        mesh.material.emissiveIntensity = 1.1 + Math.sin(elapsed * 0.5) * 0.4;
    });

    // Update sparkle particles
    const dummySparkle = new THREE.Object3D();
    sparkleData.forEach((sparkle, index) => {
        sparkle.position.add(sparkle.velocity);
        if (sparkle.position.x > 10 || sparkle.position.x < -10) sparkle.velocity.x *= -1;
        if (sparkle.position.y > 10 || sparkle.position.y < -10) sparkle.velocity.y *= -1;
        if (sparkle.position.z > 10 || sparkle.position.z < -10) sparkle.velocity.z *= -1;
        dummySparkle.position.copy(sparkle.position);
        dummySparkle.rotation.set(elapsed * 0.5, elapsed * 0.3, 0);
        dummySparkle.scale.setScalar(1 + Math.sin(elapsed + sparkle.phase) * 0.5);
        dummySparkle.updateMatrix();
        sparkleMesh.setMatrixAt(index, dummySparkle.matrix);
    });
    sparkleMesh.instanceMatrix.needsUpdate = true;
}

const clock = new THREE.Clock();

function animate() {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    controls.update();
    updateParticles(delta, elapsed);
    composer.render();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    bloomPass.setSize(innerWidth, innerHeight);
});
