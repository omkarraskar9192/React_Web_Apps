import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPlanet, setSolarTime, setIsOrbitPlaying } from '../../store/slices/uiSlice';
import {
  Sun,
  Moon,
  Sparkles,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

export default function SolarSystem() {
  const containerRef = useRef(null);
  const labelsContainerRef = useRef(null);
  const dispatch = useDispatch();

  const selectedPlanet = useSelector((state) => state.ui.selectedPlanet);
  const solarTime = useSelector((state) => state.ui.solarTime);
  const isOrbitPlaying = useSelector((state) => state.ui.isOrbitPlaying);
  const dayNightPhase = useSelector((state) => state.ui.dayNightPhase);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  // Store mutable reactive values in refs to avoid tearing down the WebGL scene!
  const selectedPlanetRef = useRef(selectedPlanet);
  const solarTimeRef = useRef(solarTime);
  const isOrbitPlayingRef = useRef(isOrbitPlaying);
  const zoomLevelRef = useRef(24);

  useEffect(() => {
    selectedPlanetRef.current = selectedPlanet;
  }, [selectedPlanet]);

  useEffect(() => {
    solarTimeRef.current = solarTime;
  }, [solarTime]);

  useEffect(() => {
    isOrbitPlayingRef.current = isOrbitPlaying;
  }, [isOrbitPlaying]);

  const planetConfigs = [
    { name: 'Sun', key: 'sun', radius: 1.6, dist: 0, speed: 0, color: 0xffaa00, isSun: true },
    { name: 'Mercury', key: 'mercury', radius: 0.22, dist: 3.2, speed: 1.6, color: 0xa8a29e },
    { name: 'Venus', key: 'venus', radius: 0.35, dist: 4.6, speed: 1.2, color: 0xf59e0b },
    { name: 'Earth', key: 'earth', radius: 0.42, dist: 6.2, speed: 0.9, color: 0x38bdf8 },
    { name: 'Mars', key: 'mars', radius: 0.28, dist: 7.9, speed: 0.75, color: 0xef4444 },
    { name: 'Jupiter', key: 'jupiter', radius: 0.82, dist: 10.2, speed: 0.48, color: 0xd97706 },
    { name: 'Saturn', key: 'saturn', radius: 0.70, dist: 12.8, speed: 0.38, color: 0xeab308, hasRing: true },
    { name: 'Uranus', key: 'uranus', radius: 0.48, dist: 15.4, speed: 0.28, color: 0x06b6d4 },
    { name: 'Neptune', key: 'neptune', radius: 0.46, dist: 17.8, speed: 0.22, color: 0x3b82f6 },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 24);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    // 4. Ambient light with cosmic indigo tint
    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.4);
    scene.add(ambientLight);

    // ================= CENTRAL ULTRA-BRIGHT SUN =================
    // 1. Blazing White-Hot Core
    const sunGeo = new THREE.SphereGeometry(1.7, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // 2. Ultra-Intense Solar Omni Light (casts brilliant light across all orbits)
    const sunLight = new THREE.PointLight(0xffffff, 85, 120, 1.1);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Secondary warm ambient glow light
    const sunWarmLight = new THREE.PointLight(0xff9d00, 45, 85, 1.3);
    sunWarmLight.position.set(0, 0, 0);
    scene.add(sunWarmLight);

    // Third golden core flare light
    const sunGoldLight = new THREE.PointLight(0xffea60, 30, 50, 1.2);
    sunGoldLight.position.set(0, 0, 0);
    scene.add(sunGoldLight);

    // 3. Inner Blazing Corona (Brilliant Golden-White Glare)
    const coronaGeo1 = new THREE.SphereGeometry(2.05, 32, 32);
    const coronaMat1 = new THREE.MeshBasicMaterial({
      color: 0xfff3a8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh1 = new THREE.Mesh(coronaGeo1, coronaMat1);
    scene.add(coronaMesh1);

    // 4. Middle Solar Flare Aura (Vibrant Radiant Amber/Orange Flare)
    const coronaGeo2 = new THREE.SphereGeometry(2.75, 32, 32);
    const coronaMat2 = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh2 = new THREE.Mesh(coronaGeo2, coronaMat2);
    scene.add(coronaMesh2);

    // 5. Outer Solar Atmosphere Halo (Deep Solar Glare)
    const coronaGeo3 = new THREE.SphereGeometry(3.9, 32, 32);
    const coronaMat3 = new THREE.MeshBasicMaterial({
      color: 0xff3700,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh3 = new THREE.Mesh(coronaGeo3, coronaMat3);
    scene.add(coronaMesh3);

    // 6. Massive Cosmic Solar Halo (Extreme radiant atmosphere)
    const coronaGeo4 = new THREE.SphereGeometry(5.4, 32, 32);
    const coronaMat4 = new THREE.MeshBasicMaterial({
      color: 0xff1a00,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh4 = new THREE.Mesh(coronaGeo4, coronaMat4);
    scene.add(coronaMesh4);

    // ================= PLANETS SETUP =================
    const planets = [];
    let earthMesh = null;
    let moonMesh = null;
    let earthSunLight = null;

    planetConfigs.forEach((cfg) => {
      if (cfg.isSun) {
        planets.push({ ...cfg, mesh: sunMesh, pivot: null, currentAngle: 0 });
        return;
      }

      // Orbital Track Line
      const orbitPoints = [];
      const segments = 96;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(theta) * cfg.dist, 0, Math.sin(theta) * cfg.dist));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: cfg.key === 'earth' ? 0x00f0ff : 0xffffff,
        transparent: true,
        opacity: cfg.key === 'earth' ? 0.45 : 0.18,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Planet Container Pivot
      const pivot = new THREE.Group();
      scene.add(pivot);

      // Planet Mesh
      const geo = new THREE.SphereGeometry(cfg.radius, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.35,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.dist, 0, 0);
      pivot.add(mesh);

      // Special handling for Earth & Moon
      if (cfg.key === 'earth') {
        earthMesh = mesh;

        // Orbiting Moon
        const moonGeo = new THREE.SphereGeometry(0.12, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          roughness: 0.8,
        });
        moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(0.9, 0.2, 0);
        mesh.add(moonMesh);

        // Directional Light simulating Sun rays on Earth
        earthSunLight = new THREE.DirectionalLight(0xffedd5, 4);
        earthSunLight.position.set(5, 0, 0);
        mesh.add(earthSunLight);
      }

      // Saturn Rings
      if (cfg.hasRing) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.3, cfg.radius * 2.3, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.5;
        mesh.add(ringMesh);
      }

      planets.push({
        ...cfg,
        pivot,
        mesh,
        currentAngle: Math.random() * Math.PI * 2,
      });
    });

    // Cosmic Stardust Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 60;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xa5b4fc,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ================= POINTER DRAG & ZOOM =================
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let targetCamRotY = 0;
    let targetCamRotX = 0.55;

    const handlePointerDown = (e) => {
      // Don't drag if clicking UI buttons
      if (e.target.closest('button') || e.target.closest('input')) return;
      isDragging = true;
      previousX = e.clientX;
      previousY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousX;
      const deltaY = e.clientY - previousY;

      targetCamRotY -= deltaX * 0.007;
      targetCamRotX = Math.max(0.08, Math.min(Math.PI / 2.2, targetCamRotX - deltaY * 0.007));

      previousX = e.clientX;
      previousY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      zoomLevelRef.current = Math.max(7, Math.min(38, zoomLevelRef.current + e.deltaY * 0.025));
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // ================= ANIMATION LOOP =================
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSelectedPlanet = selectedPlanetRef.current;
      const currentSolarTime = solarTimeRef.current;
      const playing = isOrbitPlayingRef.current;

      // 1. Planet Revolutions (realistic, graceful astronomical pace)
      planets.forEach((p) => {
        if (p.isSun) return;
        if (playing) {
          p.currentAngle += p.speed * delta * 0.08;
          p.pivot.rotation.y = p.currentAngle;
        }
        if (p.key === 'earth') {
          // Earth axial orientation directly reflects solar time of day
          p.mesh.rotation.y = currentSolarTime * Math.PI * 2;
        } else {
          p.mesh.rotation.y += delta * 0.25;
        }
      });

      sunMesh.rotation.y += delta * 0.05;

      // Pulse Sun Corona layers for dynamic, blazing brilliance
      const elapsedTime = clock.getElapsedTime();
      const p1 = 1 + Math.sin(elapsedTime * 1.8) * 0.035;
      const p2 = 1 + Math.cos(elapsedTime * 1.2) * 0.055;
      const p3 = 1 + Math.sin(elapsedTime * 0.8) * 0.075;
      const p4 = 1 + Math.cos(elapsedTime * 0.5) * 0.095;
      coronaMesh1.scale.set(p1, p1, p1);
      coronaMesh2.scale.set(p2, p2, p2);
      coronaMesh3.scale.set(p3, p3, p3);
      coronaMesh4.scale.set(p4, p4, p4);

      // 2. Moon orbit around Earth & Dynamic Solar Ray Angle
      if (moonMesh && earthMesh) {
        const moonAngle = clock.getElapsedTime() * 0.75 + currentSolarTime * Math.PI * 2;
        moonMesh.position.x = Math.cos(moonAngle) * 0.9;
        moonMesh.position.z = Math.sin(moonAngle) * 0.9;

        if (earthSunLight) {
          const sunAngle = currentSolarTime * Math.PI * 2 + Math.PI;
          earthSunLight.position.set(
            Math.cos(sunAngle) * 5,
            Math.sin(currentSolarTime * Math.PI) * 2.0,
            Math.sin(sunAngle) * 5
          );
          const dayFactor = Math.sin(currentSolarTime * Math.PI);
          earthSunLight.intensity = Math.max(0.6, dayFactor * 7.0);
        }
      }

      // 3. Camera Position
      if (currentSelectedPlanet === 'earth' && earthMesh) {
        const earthWorldPos = new THREE.Vector3();
        earthMesh.getWorldPosition(earthWorldPos);

        const targetCamPos = new THREE.Vector3(
          earthWorldPos.x + Math.sin(targetCamRotY) * 2.8,
          earthWorldPos.y + 1.2,
          earthWorldPos.z + Math.cos(targetCamRotY) * 2.8
        );
        camera.position.lerp(targetCamPos, 0.06);
        camera.lookAt(earthWorldPos);
      } else {
        const camDist = zoomLevelRef.current;
        const targetCamPos = new THREE.Vector3(
          Math.sin(targetCamRotY) * Math.cos(targetCamRotX) * camDist,
          Math.sin(targetCamRotX) * camDist,
          Math.cos(targetCamRotY) * Math.cos(targetCamRotX) * camDist
        );
        camera.position.lerp(targetCamPos, 0.06);
        camera.lookAt(0, 0, 0);
      }

      // 4. Update 2D Floating Labels in DOM directly (ZERO React state re-renders!)
      if (labelsContainerRef.current) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;

        planets.forEach((p) => {
          const el = labelsContainerRef.current.querySelector(`[data-planet="${p.key}"]`);
          if (!el) return;

          const v = new THREE.Vector3();
          p.mesh.getWorldPosition(v);
          v.y += p.radius + 0.35;
          v.project(camera);

          if (v.z < 1) {
            const x = ((v.x + 1) * cWidth) / 2;
            const y = ((-v.y + 1) * cHeight) / 2;
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
            el.style.opacity = '1';
            el.style.display = 'block';
          } else {
            el.style.opacity = '0';
            el.style.display = 'none';
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('wheel', handleWheel);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount! No tearing down on slider changes!

  return (
    <div className={`solar-canvas-frame relative w-full h-[460px] sm:h-[600px] lg:h-[700px] flex items-center justify-center select-none overflow-hidden rounded-3xl border transition-all duration-500 ${
      isDarkMode
        ? 'border-white/15 bg-slate-950/95 shadow-2xl'
        : 'border-slate-200 bg-[#080d1a] shadow-xl shadow-slate-200/50'
    }`}>
      {/* Dynamic Cosmic Nebula Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-purple-600/15 blur-3xl animate-pulse" />
      </div>

      {/* WebGL Canvas Container with touch-action: none */}
      <div
        ref={containerRef}
        style={{ touchAction: 'none' }}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate solar system in 3D. Scroll to zoom."
      />

      {/* 2D HTML Floating Planet Labels (Positioned directly via transform3d for 60fps) */}
      <div ref={labelsContainerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {planetConfigs.map((p) => (
          <div
            key={p.key}
            data-planet={p.key}
            style={{ transform: 'translate3d(-9999px, -9999px, 0)' }}
            className="absolute transition-opacity duration-150 pointer-events-auto"
          >
            <button
              onClick={() => dispatch(setSelectedPlanet(p.key))}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono border backdrop-blur-md shadow-md transition-transform hover:scale-110 cursor-pointer ${
                selectedPlanet === p.key
                  ? 'ring-2 ring-cyan-400 font-bold scale-110'
                  : ''
              } ${
                p.key === 'earth'
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                  : p.key === 'sun'
                  ? 'bg-amber-500/80 border-amber-400 text-amber-950 font-bold'
                  : 'bg-slate-900/80 border-white/20 text-slate-200'
              }`}
            >
              {p.name}
            </button>
          </div>
        ))}
      </div>

      {/* TOP BAR: Controls & View Mode */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Planet Quick Select Pills */}
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border backdrop-blur-md pointer-events-auto max-w-full overflow-x-auto shadow-xl transition-colors ${
          isDarkMode
            ? 'bg-slate-950/85 border-white/10'
            : 'bg-white/95 border-slate-200 shadow-md'
        }`}>
          <button
            onClick={() => dispatch(setSelectedPlanet('all'))}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              selectedPlanet === 'all'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md'
                : isDarkMode
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Full System
          </button>

          <button
            onClick={() => dispatch(setSelectedPlanet('earth'))}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPlanet === 'earth'
                ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Earth Deep-Dive</span>
          </button>
        </div>

        {/* Orbit Playback & Zoom Controls */}
        <div className={`flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-md pointer-events-auto shadow-xl transition-colors ${
          isDarkMode
            ? 'bg-slate-950/85 border-white/10'
            : 'bg-white/95 border-slate-200 shadow-md'
        }`}>
          <button
            onClick={() => dispatch(setIsOrbitPlaying(!isOrbitPlaying))}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
            }`}
            title={isOrbitPlaying ? 'Pause orbits' : 'Play orbits'}
          >
            {isOrbitPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => (zoomLevelRef.current = Math.max(7, zoomLevelRef.current - 4))}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
            }`}
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => (zoomLevelRef.current = Math.min(38, zoomLevelRef.current + 4))}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
            }`}
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              dispatch(setSelectedPlanet('all'));
              zoomLevelRef.current = 24;
            }}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950'
            }`}
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= SPECIAL EARTH DAY / NIGHT TRANSITION CONTROLLER ================= */}
      {selectedPlanet === 'earth' && (
        <div className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom duration-200 transition-all ${
          isDarkMode
            ? 'bg-slate-950/95 border-cyan-500/40 text-white'
            : 'bg-white border-slate-200 text-slate-950 shadow-2xl'
        }`}>
          {/* Status Label */}
          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isDarkMode ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400' : 'bg-amber-100 border border-amber-300 text-amber-600'
            }`}>
              {dayNightPhase === 'day' || dayNightPhase === 'dawn' ? (
                <Sun className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
              ) : (
                <Moon className="w-5 h-5 text-cyan-300" />
              )}
            </div>
            <div>
              <p className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDarkMode ? 'text-cyan-400' : 'text-amber-700'
              }`}>
                <span>Earth Day/Night Engine</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                  isDarkMode ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300' : 'bg-amber-100 border-amber-300 text-amber-900'
                }`}>
                  {dayNightPhase.toUpperCase()} MODE
                </span>
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Slide across 24 hours to transition between Light Mode & Dark Mode.
              </p>
            </div>
          </div>

          {/* Celestial Slider: 00:00 Night -> 12:00 Noon -> 24:00 Night */}
          <div className="flex items-center gap-3 w-full md:w-80">
            <span className={`text-xs font-mono flex items-center gap-1 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Moon className="w-3.5 h-3.5 text-cyan-400" /> 00:00
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={solarTime}
              onChange={(e) => dispatch(setSolarTime(parseFloat(e.target.value)))}
              className="w-full accent-cyan-400 cursor-pointer h-2.5 rounded-lg bg-gradient-to-r from-indigo-950 via-amber-300 to-indigo-950"
              title="Slide time of day"
            />

            <span className={`text-xs font-mono flex items-center gap-1 shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              24:00 <Moon className="w-3.5 h-3.5 text-cyan-400" />
            </span>
          </div>

          {/* Quick Noon (Day) and Midnight (Night) toggles & Return button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setSolarTime(0.5))}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                !isDarkMode
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                  : 'bg-white/5 hover:bg-white/15 text-amber-300 border-amber-500/30'
              }`}
              title="Switch to 12:00 Noon (Light Mode)"
            >
              <Sun className="w-3 h-3 text-amber-500" /> Noon
            </button>

            <button
              onClick={() => dispatch(setSolarTime(0.0))}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isDarkMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Switch to 00:00 Midnight (Dark Mode)"
            >
              <Moon className="w-3 h-3 text-cyan-400" /> Night
            </button>

            <button
              onClick={() => dispatch(setSelectedPlanet('all'))}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white border-white/15' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              &larr; System
            </button>
          </div>
        </div>
      )}

      {/* Manual Drag & Rotate Hint */}
      {selectedPlanet !== 'earth' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Click & drag to orbit solar system &bull; Scroll to zoom</span>
        </div>
      )}
    </div>
  );
}
