import * as THREE from '../../build/threejs/three.module.min.js';

class StarBackground {
    constructor(page) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            page.clientWidth / page.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(page.clientWidth, page.clientHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.canvas = this.renderer.domElement;
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        page.appendChild(this.canvas);

        this.elapsed = 0;
        this.createStars();
        this.animate();

        window.addEventListener('resize', () => this.handleResize());
    }

    createStars() {
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
                    gl_PointSize = size * (200.0 / -mv.z);
                    vOpacity = 0.5 + 0.5 * sin(elapsed + phase);
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying float vOpacity;
                void main() {
                    float d = distance(gl_PointCoord, vec2(0.5));
                    float alpha = smoothstep(0.5, 0.45, d) * vOpacity;
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.elapsed += 0.016;
        this.stars.rotation.x += 0.0002;
        this.stars.rotation.y += 0.0002;
        this.stars.material.uniforms.elapsed.value = this.elapsed;
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const parent = this.canvas.parentElement;
        this.camera.aspect = parent.clientWidth / parent.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(parent.clientWidth, parent.clientHeight);
    }
}

function init() {
    const pages = document.querySelectorAll('.page');
    console.log(pages);

    for (let i = 0; i < Math.min(3, pages.length); i++) {
        new StarBackground(pages[i]);
    }
}

document.addEventListener('DOMContentLoaded', init);