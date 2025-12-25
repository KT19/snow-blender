import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import houseRoofUrl from '../assets/house-roof.glb?url';

export function SnowGlobe() {
    const glassRef = useRef<THREE.Mesh>(null);
    const { scene } = useGLTF(houseRoofUrl);



    return (
        <group>
            {/* The Glass Sphere */}
            <mesh ref={glassRef} castShadow receiveShadow>
                <sphereGeometry args={[3.5, 70, 70]} />
                <meshPhysicalMaterial
                    roughness={0}
                    transmission={1}
                    thickness={0.15}
                    ior={1.5}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    color="#ffffff"
                    attenuationColor="#ff9999" // Slight red tint
                    attenuationDistance={0.9}
                    envMapIntensity={0.3} // Keep some reflection for definition
                />
            </mesh>


            {/* The House Model inside */}
            <primitive
                object={scene}
                scale={0.8}
                position={[0, -1.5, 0]}
            />

            {/* Internal "ground" for the snow to sit on inside the globe */}
            <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2.5, 32]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}
