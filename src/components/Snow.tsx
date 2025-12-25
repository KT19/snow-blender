import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';

export function Snow({ count: initialCount = 4000 }) {
    const points = useRef<THREE.Points>(null);

    const { count, speed, opacity, color } = useControls('Snow', {
        count: { value: initialCount, min: 100, max: 10000, step: 100 },
        speed: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
        opacity: { value: 0.5, min: 0.1, max: 1.0, step: 0.05 },
        color: { value: '#ffffff' },
    });

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const spread = 50; // Width of the area
        for (let i = 0; i < count; i++) {
            // Uniform distribution centered around 0,0
            positions[i * 3] = (Math.random() - 0.5) * spread;     // x: -spread/2 to spread / 2
            positions[i * 3 + 1] = Math.random() * 10 + 5;         // y: 5 to 15
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread; // z: -spread/2 to spread / 2
        }
        return positions;
    }, [count]);

    const speeds = useMemo(() => {
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) s[i] = Math.random() * 0.5 + 0.5; // Multiplier for base speed
        return s;
    }, [count]);


    useFrame(() => {
        if (!points.current) return;

        // Access the position attribute
        const positions = points.current.geometry.attributes.position.array as Float32Array;
        const spread = 50;

        for (let i = 0; i < count; i++) {
            // Move down based on individual speed multiplier and global speed control
            positions[i * 3 + 1] -= speeds[i] * speed;

            // Reset if it goes below a certain y threshold
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = 10;
                positions[i * 3] = (Math.random() - 0.5) * spread;
                positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
            }
        }

        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlesPosition, 3]}
                    count={particlesPosition.length / 3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation={true}
            />
        </points>
    );
}
