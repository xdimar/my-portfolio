'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────
//  GLSL Vertex Shader – Multi-Layer Sinusoidal Wave
// ─────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uWaveSpeed;
  uniform vec2  uMouseInfluence;

  varying vec2  vUv;
  varying float vElevation;
  varying float vDistFromCenter;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * uWaveFrequency + uTime * uWaveSpeed) *
                  cos(pos.y * uWaveFrequency * 0.7 + uTime * uWaveSpeed * 0.8);
    float wave2 = sin((pos.x + pos.y) * uWaveFrequency * 0.6 + uTime * uWaveSpeed * 1.3) * 0.5;
    float wave3 = cos(pos.x * uWaveFrequency * 1.2 - pos.y * uWaveFrequency * 0.9 + uTime * uWaveSpeed * 0.6) * 0.3;

    float mouseWave = sin(distance(pos.xy, uMouseInfluence * 12.0) * 1.2 - uTime * 3.0) * 0.4;
    mouseWave *= smoothstep(8.0, 0.0, distance(pos.xy, uMouseInfluence * 12.0));

    float elevation = (wave1 + wave2 + wave3 + mouseWave) * uWaveAmplitude;
    pos.z += elevation;

    vElevation       = elevation;
    vDistFromCenter  = length(pos.xy) / 18.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────
//  GLSL Fragment Shader – Metallic Shimmer
// ─────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorAccent;
  uniform float uOpacity;

  varying vec2  vUv;
  varying float vElevation;
  varying float vDistFromCenter;

  void main() {
    float t = (vElevation + 1.2) * 0.42;
    vec3 baseColor = mix(uColorA, uColorB, t);

    float shimmer = pow(max(0.0, vElevation / 1.2), 2.5);
    baseColor = mix(baseColor, uColorAccent, shimmer * 0.7);

    float glow = abs(sin(vUv.x * 12.0 + uTime * 0.8)) * 0.12;
    baseColor += uColorA * glow;

    float edgeFade = 1.0 - smoothstep(0.3, 1.0, vDistFromCenter);
    float alpha = uOpacity * edgeFade;

    gl_FragColor = vec4(baseColor, alpha);
  }
`;

// ─────────────────────────────────────────────────────────
//  Helper: parse hex CSS color → THREE.Vector3
// ─────────────────────────────────────────────────────────
function cssVarToVec3(
  varName: string,
  fallback: [number, number, number]
): THREE.Vector3 {
  if (typeof window === 'undefined') return new THREE.Vector3(...fallback);
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
    .replace('#', '');
  if (!raw) return new THREE.Vector3(...fallback);
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const n = parseInt(full.slice(0, 6), 16);
  if (isNaN(n)) return new THREE.Vector3(...fallback);
  return new THREE.Vector3((n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export default function LiquidMetalGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // ── Read theme colors ──────────────────────────────────────────────
    const getCssStr = (v: string, fb: string) =>
      (typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue(v).trim()
        : '') || fb;

    const colorCyanStr   = getCssStr('--neon-cyan',   '#00f2fe');
    const colorPurpleStr = getCssStr('--neon-purple',  '#9d4edd');
    const colorBlueStr   = getCssStr('--neon-blue',    '#38bdf8');

    const vecCyan   = cssVarToVec3('--neon-cyan',   [0.0,   0.949, 0.996]);
    const vecPurple = cssVarToVec3('--neon-purple',  [0.615, 0.306, 0.933]);

    // ── Scene / Camera / Renderer ──────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, -6, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha:           true,
      antialias:       true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // ── Liquid Metal Shader Mesh ───────────────────────────────────────
    const gridSegments = 90;
    const gridSize     = 36;
    const planeGeo  = new THREE.PlaneGeometry(gridSize, gridSize, gridSegments, gridSegments);
    const shaderMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:           { value: 0 },
        uWaveAmplitude:  { value: 1.2 },
        uWaveFrequency:  { value: 0.38 },
        uWaveSpeed:      { value: 0.55 },
        uMouseInfluence: { value: new THREE.Vector2(0, 0) },
        uColorA:         { value: vecCyan },
        uColorB:         { value: vecPurple },
        uColorAccent:    { value: new THREE.Vector3(1, 1, 1) },
        uOpacity:        { value: 0.55 },
      },
      transparent: true,
      side:        THREE.DoubleSide,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const planeMesh = new THREE.Mesh(planeGeo, shaderMat);
    planeMesh.rotation.x = -Math.PI / 2.6;
    planeMesh.position.y = -2;
    scene.add(planeMesh);

    // ── Wireframe Grid Overlay ─────────────────────────────────────────
    const wireGeo = new THREE.PlaneGeometry(gridSize, gridSize, 28, 28);
    const wireMat = new THREE.MeshBasicMaterial({
      color:       new THREE.Color(colorCyanStr),
      wireframe:   true,
      transparent: true,
      opacity:     0.12,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.rotation.x = -Math.PI / 2.6;
    wireMesh.position.y = -2;
    scene.add(wireMesh);

    // ── Floating Light Orbs ────────────────────────────────────────────
    interface Orb {
      mesh:   THREE.Mesh;
      speed:  number;
      offset: number;
      orbitR: number;
      orbitY: number;
    }
    const orbs: Orb[]   = [];
    const orbColors     = [colorCyanStr, colorPurpleStr, colorBlueStr];

    for (let i = 0; i < 6; i++) {
      const geo  = new THREE.SphereGeometry(0.12 + Math.random() * 0.18, 8, 8);
      const mat  = new THREE.MeshBasicMaterial({
        color:       new THREE.Color(orbColors[i % 3]),
        transparent: true,
        opacity:     0.7 + Math.random() * 0.3,
      });
      const mesh   = new THREE.Mesh(geo, mat);
      const orbitR = 3 + Math.random() * 6;
      const orbitY = -1 + Math.random() * 6;
      const phase  = Math.random() * Math.PI * 2;
      const speed  = 0.18 + Math.random() * 0.25;
      const offset = Math.random() * Math.PI * 2;

      mesh.position.set(Math.cos(phase) * orbitR, orbitY, Math.sin(phase) * orbitR);
      scene.add(mesh);
      orbs.push({ mesh, speed, offset, orbitR, orbitY });
    }

    // ── Horizon Glow Rings ─────────────────────────────────────────────
    const glowGeo  = new THREE.TorusGeometry(10, 0.05, 8, 120);
    const glowMat  = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorCyanStr), transparent: true, opacity: 0.25 });
    const glowRing = new THREE.Mesh(glowGeo, glowMat);
    glowRing.rotation.x = -Math.PI / 2.6;
    glowRing.position.y = -2;
    scene.add(glowRing);

    const glowGeo2  = new THREE.TorusGeometry(7, 0.03, 8, 80);
    const glowMat2  = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorPurpleStr), transparent: true, opacity: 0.2 });
    const glowRing2 = new THREE.Mesh(glowGeo2, glowMat2);
    glowRing2.rotation.x = -Math.PI / 2.6;
    glowRing2.position.y = -2;
    scene.add(glowRing2);

    // ── Mouse Tracking ─────────────────────────────────────────────────
    let mouseNormX = 0, mouseNormY = 0;
    let targetCamX = 0, targetCamY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseNormX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseNormY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ─────────────────────────────────────────────────
    let animId:    number;
    let isVisible  = true;
    const clock    = { start: performance.now(), paused: 0, pauseStart: 0 };

    const animate = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - clock.start - clock.paused) * 0.001;

      shaderMat.uniforms.uTime.value = elapsed;
      shaderMat.uniforms.uMouseInfluence.value.set(mouseNormX, mouseNormY);

      targetCamX += (mouseNormX * 1.8 - targetCamX) * 0.04;
      targetCamY += (-mouseNormY * 1.2 - targetCamY) * 0.04;
      camera.position.x = targetCamX;
      camera.position.y = -6 + targetCamY;
      camera.lookAt(0, 2, 0);

      wireMesh.rotation.z = Math.sin(elapsed * 0.15) * 0.02;

      glowRing.rotation.z  = elapsed * 0.05;
      glowMat.opacity      = 0.18 + Math.sin(elapsed * 1.2) * 0.08;
      glowRing2.rotation.z = -elapsed * 0.08;
      glowMat2.opacity     = 0.14 + Math.cos(elapsed * 0.9) * 0.06;

      orbs.forEach((orb, i) => {
        const t = elapsed * orb.speed + orb.offset;
        orb.mesh.position.x = Math.cos(t) * orb.orbitR;
        orb.mesh.position.z = Math.sin(t) * orb.orbitR * 0.5;
        orb.mesh.position.y = orb.orbitY + Math.sin(elapsed * 0.6 + i) * 1.2;
        (orb.mesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 + Math.sin(elapsed * 1.5 + orb.offset) * 0.3;
      });

      renderer.render(scene, camera);
    };

    renderer.render(scene, camera);
    animate();

    // ── IntersectionObserver ───────────────────────────────────────────
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && currentMount) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              clock.paused += performance.now() - clock.pauseStart;
              clock.pauseStart = 0;
              animate();
            }
          } else {
            if (isVisible) {
              isVisible = false;
              clock.pauseStart = performance.now();
              cancelAnimationFrame(animId);
            }
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(currentMount);
    }

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      observer?.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);

      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();  shaderMat.dispose();
      wireGeo.dispose();   wireMat.dispose();
      glowGeo.dispose();   glowMat.dispose();
      glowGeo2.dispose();  glowMat2.dispose();
      orbs.forEach((o) => {
        o.mesh.geometry.dispose();
        (o.mesh.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        1,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
      aria-hidden="true"
    />
  );
}
