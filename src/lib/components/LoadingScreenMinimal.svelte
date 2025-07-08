<script lang="ts">
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement;

    onMount(() => {
        if (!browser) return;

        // Dynamic import to avoid SSR issues
        import('three').then((THREE) => {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0a);

            const camera = new THREE.PerspectiveCamera(
                50,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            camera.position.z = 15;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(5, 10, 5);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const accentLight = new THREE.DirectionalLight(0xff6600, 0.3);
            accentLight.position.set(-5, -5, -5);
            scene.add(accentLight);

            // Create 3D text using boxes
            const group = new THREE.Group();
            const word = 'NORBEDO';
            const blockSize = 0.4;
            const letterSpacing = 2.5;
            const depth = 0.8;

            // Simple block letter patterns (5x5 grid)
            const letters: Record<string, boolean[][]> = {
                N: [
                    [true, false, false, false, true],
                    [true, true, false, false, true],
                    [true, false, true, false, true],
                    [true, false, false, true, true],
                    [true, false, false, false, true]
                ],
                O: [
                    [false, true, true, true, false],
                    [true, false, false, false, true],
                    [true, false, false, false, true],
                    [true, false, false, false, true],
                    [false, true, true, true, false]
                ],
                R: [
                    [true, true, true, true, false],
                    [true, false, false, false, true],
                    [true, true, true, true, false],
                    [true, false, true, false, false],
                    [true, false, false, true, false]
                ],
                B: [
                    [true, true, true, true, false],
                    [true, false, false, false, true],
                    [true, true, true, true, false],
                    [true, false, false, false, true],
                    [true, true, true, true, false]
                ],
                E: [
                    [true, true, true, true, true],
                    [true, false, false, false, false],
                    [true, true, true, true, false],
                    [true, false, false, false, false],
                    [true, true, true, true, true]
                ],
                D: [
                    [true, true, true, true, false],
                    [true, false, false, false, true],
                    [true, false, false, false, true],
                    [true, false, false, false, true],
                    [true, true, true, true, false]
                ]
            };

            const geometry = new THREE.BoxGeometry(blockSize, blockSize, depth);
            const material = new THREE.MeshStandardMaterial({
                color: 0xff4500,
                metalness: 0.3,
                roughness: 0.4,
                emissive: 0xff2200,
                emissiveIntensity: 0.1
            });

            // Create letters
            word.split('').forEach((letter, letterIndex) => {
                const letterGroup = new THREE.Group();
                const pattern = letters[letter];

                if (pattern) {
                    pattern.forEach((row, y) => {
                        row.forEach((isBlock, x) => {
                            if (isBlock) {
                                const mesh = new THREE.Mesh(geometry, material);
                                mesh.position.set(
                                    x * blockSize - 2 * blockSize,
                                    -y * blockSize + 2 * blockSize,
                                    0
                                );
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                letterGroup.add(mesh);
                            }
                        });
                    });
                }

                letterGroup.position.x = (letterIndex - word.length / 2 + 0.5) * letterSpacing;
                group.add(letterGroup);
            });

            scene.add(group);

            // Animation
            function animate() {
                requestAnimationFrame(animate);
                group.rotation.y += 0.005;
                renderer.render(scene, camera);
            }

            animate();

            // Handle resize
            function handleResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                renderer.dispose();
            };
        });
    });
</script>

{#if browser}
    <div class="fixed inset-0 bg-black">
        <canvas bind:this={canvas} class="h-full w-full"></canvas>
    </div>
{/if}

<style>
    @keyframes pulse {
        0%,
        100% {
            opacity: 0.2;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }
</style>
