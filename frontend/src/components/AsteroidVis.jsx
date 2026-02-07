import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Vector3 } from 'three';
import { OrbitControls, Stars, Html, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';
import { X, Play, Pause, FastForward, Rewind } from 'lucide-react';

const Earth = ({ rotationY }) => {
    const earthRef = useRef();
    const cloudsRef = useRef();

    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);

    useFrame(() => {
        if (earthRef.current) earthRef.current.rotation.y = rotationY;
        if (cloudsRef.current) cloudsRef.current.rotation.y = rotationY * 1.2;
    });

    return (
        <>
            <mesh ref={earthRef}>
                <sphereGeometry args={[2, 32, 32]} />
                <meshPhongMaterial map={colorMap} normalMap={normalMap} specularMap={specularMap} shininess={5} />
            </mesh>
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[2.04, 32, 32]} />
                <meshStandardMaterial map={cloudsMap} transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
        </>
    );
};

const CameraRig = ({ focusTarget, controlsRef, setIsTransitioning, time }) => {
    const { camera } = useThree();
    const [targetCameraPos, setTargetCameraPos] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevTargetPos = useRef(null);

    useFrame((state, delta) => {
        if (!focusTarget || !controlsRef.current) return;

        const currentTargetPos = new Vector3(...focusTarget.position);

        if (isAnimating && targetCameraPos) {
            controlsRef.current.target.lerp(currentTargetPos, 0.1);
            state.camera.position.lerp(targetCameraPos, 0.05);

            if (state.camera.position.distanceTo(targetCameraPos) < 0.5) {
                setIsAnimating(false);
                prevTargetPos.current = currentTargetPos.clone();
            }
        }
        else if (!isAnimating && prevTargetPos.current) {
            const deltaMove = currentTargetPos.clone().sub(prevTargetPos.current);
            state.camera.position.add(deltaMove);
            controlsRef.current.target.copy(currentTargetPos);
            prevTargetPos.current = currentTargetPos.clone();
        }

        controlsRef.current.update();
    });

    useEffect(() => {
        if (focusTarget) {
            const targetPos = new Vector3(...focusTarget.position);
            const direction = camera.position.clone().sub(targetPos).normalize();
            const offsetDist = 15;
            const newPos = targetPos.clone().add(direction.multiplyScalar(offsetDist));

            setTargetCameraPos(newPos);
            setIsAnimating(true);
            prevTargetPos.current = null;
            if (setIsTransitioning) setIsTransitioning(true);
        } else {
            setIsAnimating(false);
            prevTargetPos.current = null;
            if (setIsTransitioning) setIsTransitioning(false);
        }
    }, [focusTarget?.id]);

    return null;
};

const Asteroid = ({ data, onSelect, isFocused, position, visualProps }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const rockTexture = useLoader(TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += visualProps.rotSpeedX;
            meshRef.current.rotation.y += visualProps.rotSpeedY;
        }
    });

    const isHazardous = data.is_potentially_hazardous_asteroid;
    const sizeBase = isHazardous ? 0.8 : 0.5;
    const finalScale = [
        visualProps.scale[0] * sizeBase,
        visualProps.scale[1] * sizeBase,
        visualProps.scale[2] * sizeBase
    ];

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect(data.id);
    };

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                scale={finalScale}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={(e) => setHovered(false)}
                onClick={handleClick}
                className="cursor-pointer"
            >
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    map={rockTexture}
                    color={hovered || isFocused ? "#ffff00" : visualProps.color}
                    roughness={0.9}
                    metalness={0.1}
                    emissive={hovered || isFocused ? "#333300" : "#000000"}
                />
            </mesh>

            {isFocused && (
                <Billboard>
                    <mesh>
                        <ringGeometry args={[sizeBase * 1.5, sizeBase * 1.8, 32]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.8} side={THREE.DoubleSide} />
                    </mesh>
                </Billboard>
            )}

            {hovered && !isFocused && (
                <Html distanceFactor={15}>
                    <div className="bg-slate-900/90 text-white p-2 rounded border border-slate-600 text-xs w-max pointer-events-none z-40">
                        <div className="font-bold text-cyan-400">{data.name}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

const OrbitPath = ({ a, e, inclination, rotation, color }) => {
    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
            let x = r * Math.cos(theta);
            let z = r * Math.sin(theta);
            const xRot = x * Math.cos(rotation) - z * Math.sin(rotation);
            const zRot = x * Math.sin(rotation) + z * Math.cos(rotation);
            const y = zRot * Math.sin(inclination);
            const zFinal = zRot * Math.cos(inclination);
            pts.push(new Vector3(xRot, y, zFinal));
        }
        return pts;
    }, [a, e, inclination, rotation]);

    return (
        <Line points={points} color={color} opacity={0.15} transparent lineWidth={1} />
    );
};

const AsteroidVis = ({ asteroids }) => {
    const [focusedAsteroidId, setFocusedAsteroidId] = useState(null);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const controlsRef = useRef();

    const orbitalData = useMemo(() => {
        return asteroids.map(ast => {
            const distKm = parseFloat(ast.close_approach_data[0]?.miss_distance?.kilometers || 0);

            const semiMajorAxis = 8 + Math.min(distKm / 100000, 40);

            const eccentricity = 0.2 + Math.random() * 0.4;

            const rotation = Math.random() * Math.PI * 2;

            const speedBase = parseFloat(ast.close_approach_data[0]?.relative_velocity?.kilometers_per_second || 20);
            const orbitalSpeed = (speedBase / 100) * (10 / semiMajorAxis);
            const inclination = (Math.random() - 0.5) * 0.5;
            const phase = Math.random() * Math.PI * 2;

            const isHazardous = ast.is_potentially_hazardous_asteroid;

            const scaleX = 0.8 + Math.random() * 0.4;
            const scaleY = 0.8 + Math.random() * 0.4;
            const scaleZ = 0.8 + Math.random() * 0.4;
            const hazardousColors = ["#ffcccc", "#ffaaaa", "#ff8888"];
            const safeColors = ["#ffffff", "#dddddd", "#cccccc", "#bbbbbb"];
            const palette = isHazardous ? hazardousColors : safeColors;
            const color = palette[Math.floor(Math.random() * palette.length)];
            const rotSpeedX = (Math.random() - 0.5) * 0.02;
            const rotSpeedY = (Math.random() - 0.5) * 0.02;

            return {
                id: ast.id,
                originalData: ast,
                visualProps: { scale: [scaleX, scaleY, scaleZ], color, rotSpeedX, rotSpeedY },
                orbit: {
                    a: semiMajorAxis,
                    e: eccentricity,
                    i: inclination,
                    w: rotation,
                    speed: orbitalSpeed,
                    phase
                },
                diameterMax: ast.estimated_diameter?.meters?.estimated_diameter_max || 0,
                baseSpeed: speedBase
            };
        });
    }, [asteroids]);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            if (isPlaying) {
                setTime(prev => prev + (0.01 * speed));
            }
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying, speed]);

    const currentStatus = useMemo(() => {
        return orbitalData.map(item => {
            const theta = item.orbit.phase + (time * item.orbit.speed);
            const r = (item.orbit.a * (1 - item.orbit.e * item.orbit.e)) / (1 + item.orbit.e * Math.cos(theta));

            let x = r * Math.cos(theta);
            let z = r * Math.sin(theta);

            const xRot = x * Math.cos(item.orbit.w) - z * Math.sin(item.orbit.w);
            const zRot = x * Math.sin(item.orbit.w) + z * Math.cos(item.orbit.w);

            const y = zRot * Math.sin(item.orbit.i);
            const zFinal = zRot * Math.cos(item.orbit.i);

            const distUnits = r;

            let sizePoints = (item.diameterMax / 1000) * 40;
            if (sizePoints > 40) sizePoints = 40;

            let distPoints = 0;
            const minDist = 4;
            const maxDist = 25;

            if (distUnits < maxDist) {
                const factor = 1 - Math.max(0, (distUnits - minDist) / (maxDist - minDist));
                distPoints = 40 * factor;
            }

            let speedPoints = (item.baseSpeed / 40) * 20;
            if (speedPoints > 20) speedPoints = 20;

            const totalRisk = Math.min(100, Math.round(sizePoints + distPoints + speedPoints));

            return {
                ...item,
                currentPos: [xRot, y, zFinal],
                currentRisk: totalRisk,
                currentDistUnits: distUnits
            };
        });
    }, [orbitalData, time]);

    const sortedRisks = useMemo(() => {
        return [...currentStatus].sort((a, b) => b.currentRisk - a.currentRisk);
    }, [currentStatus]);

    const focusedAsteroidObj = useMemo(() => {
        if (!focusedAsteroidId) return null;
        const item = currentStatus.find(it => it.id === focusedAsteroidId);
        if (!item) return null;
        return {
            position: item.currentPos,
            data: item.originalData,
            id: item.id,
            risk: item.currentRisk
        };
    }, [focusedAsteroidId, currentStatus]);

    return (
        <div className="w-full h-[700px] bg-black rounded-2xl overflow-hidden relative border border-slate-700 shadow-2xl flex">

            <div className="w-64 bg-slate-900/90 border-r border-slate-700 p-4 overflow-y-auto hidden md:block z-10 custom-scrollbar">
                <h3 className="text-cyan-400 font-bold mb-4 flex items-center justify-between">
                    <span>Live Threat Monitor</span>
                    <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded animate-pulse">LIVE</span>
                </h3>
                <div className="space-y-2">
                    {sortedRisks.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setFocusedAsteroidId(item.id)}
                            className={`p-2 rounded cursor-pointer transition-all border ${focusedAsteroidId === item.id
                                    ? 'bg-nasa-blue/30 border-cyan-400'
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-200">{item.originalData.name}</span>
                                <span className={`font-mono font-bold ${item.currentRisk > 50 ? 'text-red-400' : 'text-green-400'}`}>
                                    {item.currentRisk}%
                                </span>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                                <span>Dist: {item.currentDistUnits.toFixed(1)} E_RAD</span>
                            </div>
                            <div className="mt-1 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.currentRisk > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${item.currentRisk}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative">
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-2xl bg-slate-950/90 backdrop-blur-md px-6 py-4 rounded-sm border border-cyan-900 shadow-2xl flex flex-col gap-4">

                    <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">
                                {isPlaying ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}
                            </span>
                        </div>
                        <div className="text-xs font-mono text-cyan-300">
                            COORD: T+{time.toFixed(4)}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`
                                w-16 h-16 flex items-center justify-center border-2 rounded-sm transition-all
                                ${isPlaying
                                    ? 'border-red-500 text-red-500 hover:bg-red-900/20'
                                    : 'border-cyan-500 text-cyan-500 hover:bg-cyan-900/20 hover:scale-105'
                                }
                            `}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>

                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                                <span>Timeline Scrub</span>
                                <span>Dilation: {speed}x</span>
                            </div>

                            <div className="relative h-6 w-full flex items-center">
                                <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none opacity-30">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-[1px] h-2 bg-cyan-500"></div>
                                    ))}
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={time % 100}
                                    onChange={(e) => {
                                        setTime(parseFloat(e.target.value));
                                        setIsPlaying(false);
                                    }}
                                    className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-none appearance-none cursor-pointer z-10 hover:h-2 transition-all"
                                />
                            </div>

                            <div className="flex gap-1 justify-end">
                                {[0.5, 1, 2, 4, 8].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSpeed(s)}
                                        className={`
                                            px-2 py-1 text-[10px] font-mono border transition-colors
                                            ${speed === s
                                                ? 'bg-cyan-500 text-black border-cyan-500'
                                                : 'text-cyan-500 border-cyan-900 hover:border-cyan-500'
                                            }
                                        `}
                                    >
                                        x{s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {focusedAsteroidObj && (
                    <div className="absolute top-4 right-4 z-20 w-64 bg-slate-900/90 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-10">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-cyan-400">{focusedAsteroidObj.data.name}</h3>
                            <button
                                onClick={() => setFocusedAsteroidId(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex justify-between border-b border-slate-700 pb-2 mb-2">
                                <span className="text-xs uppercase tracking-wider text-slate-500">Live Risk</span>
                                <span className={`font-bold ${focusedAsteroidObj.risk > 50 ? "text-red-500" : "text-green-500"}`}>
                                    {focusedAsteroidObj.risk}/100
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Hazardous:</span>
                                <span className={focusedAsteroidObj.data.is_potentially_hazardous_asteroid ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                                    {focusedAsteroidObj.data.is_potentially_hazardous_asteroid ? "YES" : "NO"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Est. Diameter:</span>
                                <span>
                                    {focusedAsteroidObj.data.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(3)} km
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Velocity:</span>
                                <span>
                                    {parseFloat(focusedAsteroidObj.data.close_approach_data[0]?.relative_velocity?.kilometers_per_hour).toFixed(0)} km/h
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <Canvas camera={{ position: [0, 10, 30], fov: 45 }}>
                    <ambientLight intensity={1.2} />
                    <pointLight position={[10, 10, 10]} intensity={2.5} />
                    <pointLight position={[-10, -10, -10]} intensity={1.0} color="#4444ff" />
                    <Stars radius={300} depth={60} count={5000} factor={6} saturation={0} fade />

                    <Suspense fallback={null}>
                        <Earth rotationY={time * 0.5} />
                        {currentStatus.map((item) => (
                            <group key={item.id}>
                                <Asteroid
                                    data={item.originalData}
                                    position={item.currentPos}
                                    visualProps={item.visualProps}
                                    onSelect={setFocusedAsteroidId}
                                    isFocused={focusedAsteroidId === item.id}
                                />
                                <OrbitPath
                                    a={item.orbit.a}
                                    e={item.orbit.e}
                                    inclination={item.orbit.i}
                                    rotation={item.orbit.w}
                                    color={item.visualProps.color}
                                />
                            </group>
                        ))}
                    </Suspense>

                    <OrbitControls
                        ref={controlsRef}
                        enablePan={true}
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={300}
                    />

                    <CameraRig
                        focusTarget={focusedAsteroidObj}
                        controlsRef={controlsRef}
                        time={time}
                    />
                </Canvas>
            </div>
        </div>
    );
};

export default AsteroidVis;
