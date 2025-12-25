import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SnowGlobe } from './SnowGlobe';
import { TimeLapseLights } from './TimeLapseLights';
import { Snow } from './Snow';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useControls } from 'leva';

export default function Scene() {
    const { bgFrom, bgVia, bgTo, autoRotateSpeed } = useControls('Scene', {
        bgFrom: { value: '#1d315fff', label: 'BG Outer' }, 
        bgVia: { value: '#68527aff', label: 'BG Mid' },
        bgTo: { value: '#6d4c72da', label: 'BG Center' },
        autoRotateSpeed: { value: 0.5, min: 0, max: 5, step: 0.1 },
    });

    return (
        <div
            className="w-full h-screen relative"
            style={{ background: `radial-gradient(circle at 50% 0%, ${bgFrom}, ${bgVia}, ${bgTo})` }}
        >


            <Canvas shadows gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8 }}>
                <fog attach="fog" args={['#646568', 5, 25]} />

                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                <OrbitControls
                    enablePan={false}
                    minDistance={4}
                    maxDistance={12}
                    autoRotate={true}
                    autoRotateSpeed={autoRotateSpeed}
                />

                <TimeLapseLights />

                <Suspense fallback={null}>
                    <group position={[0, 0, 0]}>
                        <SnowGlobe />
                        <Snow count={4000} />
                    </group>
                    <Environment preset="studio" />
                </Suspense>

                <ContactShadows
                    resolution={1024}
                    scale={20}
                    blur={2} // Softer blur
                    opacity={0.4}
                    far={10}
                    color="#000000"
                    frames={1} // Bake once to avoid noise from snow
                />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={500} intensity={0.01} />
                </EffectComposer>
            </Canvas>

            <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
                <h1 className="text-4xl font-bold text-white tracking-widest uppercase drop-shadow-md">Winter Dream</h1>
                <p className="text-white/90 mt-2 text-sm tracking-widest">Interactive 3D Experience</p>
            </div>
        </div>
    );
}
