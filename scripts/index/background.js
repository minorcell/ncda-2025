import * as THREE from '../../build/threejs/three.module.min.js';

let scene, camera, renderer;
let stars;

function init() {
    const page = document.querySelector('.page');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, page.clientWidth / page.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(page.clientWidth, page.clientHeight);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    page.appendChild(canvas);
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const phases = [];
    const sizes = [];
    for (let i = 0; i < 250; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const size = Math.random() * 1.5 + 0.5;
        vertices.push(x, y, z);
        phases.push(Math.random() * Math.PI * 2);
        sizes.push(size);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
            uniform float time;
            attribute float phase;
            attribute float size;
            varying float vOpacity;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 0.01 * size * (300.0 / -mvPosition.z);
                vOpacity = 0.5 + 0.5 * sin(time + phase);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vOpacity;
            void main() {
                gl_FragColor = vec4(color, vOpacity);
            }
        `,
        transparent: true
    });
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    stars.rotation.x += 0.0002;
    stars.rotation.y += 0.0002;
    const time = Date.now() * 0.001;
    stars.material.uniforms.time.value = time;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const page = document.querySelector('.page');
    camera.aspect = page.clientWidth / page.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(page.clientWidth, page.clientHeight);
});

document.addEventListener('DOMContentLoaded', init);