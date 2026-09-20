import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { setActive3DGeometry } from '../../store/slices/uiSlice';
import { Sparkles, Orbit } from 'lucide-react';

export default function ThreeScene() {
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const activeGeometry = useSelector((state) => state.ui.active3DGeometry);
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);
  const [isInteracting, setIsInteracting] = useState(false);

  // Keep references across renders
  const meshGroupRef = useRef(null);
  const outerWireframeRef = useRef(null);
  const coreRef = useRef(null);

  // Function to build geometric meshes without re-creating WebGL renderer
  const buildMeshes = (type) => {
    const group = meshGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    let innerGeo, outerGeo;
    if (type === 'torus') {
      innerGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32);
      outerGeo = new THREE.TorusKnotGeometry(1.23, 0.4, 64, 16);
    } else if (type === 'octahedron') {
      innerGeo = new THREE.OctahedronGeometry(1.7, 0);
      outerGeo = new THREE.OctahedronGeometry(1.84, 0);
    } else {
      // Default: Multi-faceted Crystal Icosahedron
      innerGeo = new THREE.IcosahedronGeometry(1.68, 0);
      outerGeo = new THREE.IcosahedronGeometry(1.82, 0);
    }

    // Add vertex colors for multi-color iridescent facets!
    const positionAttr = innerGeo.attributes.position;
    const colors = [];
    const colorPalette = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xff007f), // Hot Pink
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xfbbf24), // Gold
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x38bdf8), // Sky Blue
      new THREE.Color(0xec4899), // Rose
    ];

    for (let i = 0; i < positionAttr.count; i++) {
      const chosenColor = colorPalette[i % colorPalette.length];
      colors.push(chosenColor.r, chosenColor.g, chosenColor.b);
    }

    innerGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Iridescent Physical Material with vertex colors & glossy clearcoat
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.12,
      metalness: 0.65,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
      flatShading: true,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4,
    });

    const innerMesh = new THREE.Mesh(innerGeo, innerMaterial);
    group.add(innerMesh);

    // Outer Wireframe Cage with vibrant neon gradient glow
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const outerWireframe = new THREE.Mesh(outerGeo, wireframeMaterial);
    outerWireframeRef.current = outerWireframe;
    group.add(outerWireframe);

    // Inner Glowing Energy Core with warm neon magenta / orange pulse
    const coreGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff007f,
      emissiveIntensity: 3.5,
      roughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreRef.current = coreMesh;
    group.add(coreMesh);
  };

  // Switch geometry cleanly when activeGeometry changes
  useEffect(() => {
    buildMeshes(activeGeometry);
  }, [activeGeometry]);

  // Initialize WebGL Scene ONCE on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0x1e1b4b, 1.2);
    scene.add(ambientLight);

    const lightCyan = new THREE.PointLight(0x00f0ff, 12, 18);
    lightCyan.position.set(4, 3, 3);
    scene.add(lightCyan);

    const lightPink = new THREE.PointLight(0xff007f, 14, 18);
    lightPink.position.set(-4, -2, 3);
    scene.add(lightPink);

    const lightPurple = new THREE.PointLight(0x9d00ff, 10, 18);
    lightPurple.position.set(0, 4, -2);
    scene.add(lightPurple);

    const lightGold = new THREE.PointLight(0xffb703, 9, 16);
    lightGold.position.set(-3, 3, -3);
    scene.add(lightGold);

    const lightEmerald = new THREE.PointLight(0x06d6a0, 8, 16);
    lightEmerald.position.set(2, -4, 2);
    scene.add(lightEmerald);

    // Initial mesh build
    buildMeshes(activeGeometry);

    // Multi-color particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const particlePalette = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xff007f),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0x34d399),
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12 - 1;

      const pColor = particlePalette[Math.floor(Math.random() * particlePalette.length)];
      particleColors[i] = pColor.r;
      particleColors[i + 1] = pColor.g;
      particleColors[i + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Pointer Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;

        dragVelocityX = deltaX * 0.008;
        dragVelocityY = deltaY * 0.008;

        targetRotationY += dragVelocityX;
        targetRotationX += dragVelocityY;

        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        mouseX = normX * 0.45;
        mouseY = normY * 0.45;
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        targetRotationY += 0.005;
        targetRotationX += 0.0022;

        targetRotationY += dragVelocityX;
        targetRotationX += dragVelocityY;
        dragVelocityX *= 0.92;
        dragVelocityY *= 0.92;
      }

      group.rotation.y += (targetRotationY + mouseX - group.rotation.y) * 0.05;
      group.rotation.x += (targetRotationX + mouseY - group.rotation.x) * 0.05;

      group.position.y = Math.sin(elapsedTime * 1.6) * 0.2;

      lightCyan.position.x = Math.sin(elapsedTime * 0.8) * 5;
      lightCyan.position.z = Math.cos(elapsedTime * 0.8) * 5;

      lightPink.position.x = Math.cos(elapsedTime * 0.9) * 5;
      lightPink.position.y = Math.sin(elapsedTime * 0.9) * 4;

      lightGold.position.y = Math.cos(elapsedTime * 0.7) * 4;
      lightGold.position.z = Math.sin(elapsedTime * 0.7) * 4;

      if (outerWireframeRef.current) {
        outerWireframeRef.current.rotation.y -= 0.004;
        outerWireframeRef.current.rotation.z += 0.003;
        const hue = (elapsedTime * 0.1) % 1;
        outerWireframeRef.current.material.color.setHSL(hue, 1.0, 0.55);
      }

      if (coreRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 3.5) * 0.12;
        coreRef.current.scale.set(pulse, pulse, pulse);
        const coreHue = (elapsedTime * 0.15 + 0.5) % 1;
        coreRef.current.material.emissive.setHSL(coreHue, 1.0, 0.5);
      }

      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.1;

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointerdown', handlePointerDown);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount!

  return (
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[560px] flex items-center justify-center select-none">
      {/* Radiant rainbow glow halo behind 3D canvas */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/25 via-fuchsia-500/25 to-amber-500/25 blur-3xl animate-pulse" />
      </div>

      {/* Three.js canvas container with touch-action: none */}
      <div
        ref={containerRef}
        style={{ touchAction: 'none' }}
        className={`w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing transition-opacity duration-300 z-10 ${
          isInteracting ? 'opacity-100' : 'opacity-95'
        }`}
        title="Click & drag to spin 360° in 3D"
      />

      {/* Floating 3D Control Pill */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-2xl text-xs transition-colors ${
        isDarkMode
          ? 'bg-slate-950/85 border-white/20 text-white shadow-cyan-500/10'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-lg shadow-slate-300/40'
      }`}>
        <span className={`flex items-center gap-1.5 pl-1 pr-2.5 border-r font-mono font-semibold ${
          isDarkMode ? 'text-slate-300 border-white/15' : 'text-slate-600 border-slate-200'
        }`}>
          <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '5s' }} />
          3D Core
        </span>

        <button
          onClick={() => dispatch(setActive3DGeometry('polyhedron'))}
          className={`px-3 py-1 rounded-full transition-all font-mono font-bold text-xs cursor-pointer ${
            activeGeometry === 'polyhedron'
              ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Crystal
        </button>

        <button
          onClick={() => dispatch(setActive3DGeometry('torus'))}
          className={`px-3 py-1 rounded-full transition-all font-mono font-bold text-xs cursor-pointer ${
            activeGeometry === 'torus'
              ? 'bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Torus
        </button>

        <button
          onClick={() => dispatch(setActive3DGeometry('octahedron'))}
          className={`px-3 py-1 rounded-full transition-all font-mono font-bold text-xs cursor-pointer ${
            activeGeometry === 'octahedron'
              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 shadow-md shadow-amber-500/30'
              : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Prism
        </button>
      </div>

      {/* Interactive Drag Hint */}
      <div className={`absolute top-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md shadow-lg border ${
        isDarkMode
          ? 'text-cyan-300 bg-slate-950/80 border-cyan-500/30 shadow-cyan-500/15'
          : 'text-cyan-800 bg-white/90 border-cyan-200 shadow-slate-200'
      }`}>
        <Sparkles className="w-3 h-3 text-cyan-500 animate-pulse" />
        <span>Drag to rotate in 360°</span>
      </div>
    </div>
  );
}
