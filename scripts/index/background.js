import * as THREE from '../../build/threejs/three.module.min.js';

let scene, camera, renderer, stars;
let elapsed = 0;

function init() {
    const page = document.querySelector('.page');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        page.clientWidth / page.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(page.clientWidth, page.clientHeight);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    page.appendChild(canvas);

    const count = 250;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        positions[3 * i] = (Math.random() - 0.5) * 40;
        positions[3 * i + 1] = (Math.random() - 0.5) * 40;
        positions[3 * i + 2] = (Math.random() - 0.5) * 40;
        phases[i] = Math.random() * Math.PI * 2;
        sizes[i] = Math.random() * 0.08 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            elapsed: { value: 0 },
            color: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
      uniform float elapsed;
      attribute float phase;
      attribute float size;
      varying float vOpacity;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (200.0 / -mv.z); // 点大小随视距缩放
        vOpacity = 0.5 + 0.5 * sin(elapsed + phase); // 闪烁透明度
        gl_Position = projectionMatrix * mv;
      }
    `,
        fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        float alpha = smoothstep(0.5, 0.45, d) * vOpacity;
        if (alpha < 0.01) discard; // 外圈像素丢弃，形成圆形
        gl_FragColor = vec4(color, alpha);
      }
    `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    stars = new THREE.Points(geometry, material);
    scene.add(stars);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    elapsed += 0.016;
    stars.rotation.x += 0.0002;
    stars.rotation.y += 0.0002;
    stars.material.uniforms.elapsed.value = elapsed;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    const page = document.querySelector('.page');
    camera.aspect = page.clientWidth / page.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(page.clientWidth, page.clientHeight);
});

document.addEventListener('DOMContentLoaded', init);
