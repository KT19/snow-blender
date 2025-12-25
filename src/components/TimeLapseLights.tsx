import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

export function TimeLapseLights() {
    const mainLight = useRef<THREE.SpotLight>(null);
    const fillLight = useRef<THREE.SpotLight>(null);

    const {
        mainIntensityMultiplier,
        fillIntensityMultiplier,
        rotationSpeed,
        warmth
    } = useControls('Lighting', {
        mainIntensityMultiplier: { value: 1.0, min: 0, max: 3, step: 0.1 },
        fillIntensityMultiplier: { value: 1.0, min: 0, max: 3, step: 0.1 },
        rotationSpeed: { value: 0.5, min: 0.0, max: 2.0, step: 0.1 },
        warmth: { value: 0.5, min: 0, max: 1, label: 'Color Warmth' } // 0=Red, 1=Orange/Yellow
    });

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() * rotationSpeed; // Speed of time-lapse

        // Circular motion for the main light
        const x = Math.sin(time) * 15;
        const z = Math.cos(time) * 15;

        if (mainLight.current) {
            mainLight.current.position.set(x, 15, z);

            // Intensity Oscillates between 5 and 15 (base)
            // Multiplied by user control
            const baseIntensity = (Math.sin(time) + 1) * 5 + 5;
            mainLight.current.intensity = baseIntensity * mainIntensityMultiplier;

            // Hue shift: modulated by warmth control
            // base hue 0 to 0.1
            const hue = (Math.sin(time * 0.2) + 1) * 0.05 + (warmth * 0.05);
            mainLight.current.color.setHSL(hue, 1, 0.5);
        }

        if (fillLight.current) {
            // Fill light acts as a counter-balance
            fillLight.current.position.set(-x, 10, -z);

            // Vary fill intensity too
            const baseFillIntensity = (Math.cos(time) + 1) * 1 + 1; // 1 to 3
            fillLight.current.intensity = baseFillIntensity * fillIntensityMultiplier;

            // Warmth offset for fill
            const warmHue = ((Math.sin(time * 0.2 + Math.PI) + 1) * 0.05) + (warmth * 0.05);
            fillLight.current.color.setHSL(warmHue, 0.8, 0.3);
        }
    });

    return (
        <>
            <ambientLight intensity={0.15} />
            <spotLight
                ref={mainLight}
                position={[15, 10, 15]}
                angle={0.4}
                penumbra={1}
                intensity={2}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <spotLight
                ref={fillLight}
                position={[-15, 10, -15]}
                angle={0.5}
                penumbra={1}
                intensity={5}
            />
        </>
    );
}
