'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group to hold all 3D cyber objects
    const cyberGroup = new THREE.Group();
    scene.add(cyberGroup);

    // 1. Central Icosahedron Cyber Core
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cyberGroup.add(coreMesh);

    // 2. Inner Glowing Core
    const innerGeo = new THREE.OctahedronGeometry(2.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    cyberGroup.add(innerMesh);

    // 3. Cybernetic Orbit Rings (representing network orbits / TKJ data rings)
    const ring1Geo = new THREE.TorusGeometry(7.5, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    cyberGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(9.2, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    cyberGroup.add(ring2);

    // 4. Network Data Nodes (Constellation Particles)
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];
    const maxRadius = 11;

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * maxRadius;

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012
        )
      );
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Glowing circle particle texture using canvas
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
        gradient.addColorStop(0.8, 'rgba(0, 242, 254, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.6,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    cyberGroup.add(particles);

    // 5. Dynamic Connecting Lines for Network Nodes
    const maxLineConnections = 240;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    cyberGroup.add(linesMesh);

    // Interactive Mouse Tracking with smooth Lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onResize);

    // Animation Loop with Visibility Optimization
    let animationFrameId: number;
    let isVisible = true;
    const startTime = performance.now();
    let pausedTime = 0;
    let pauseStart = 0;

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime - pausedTime) * 0.001;

      // Smooth camera and rotation damping
      targetRotationX += (mouseY - targetRotationX) * 0.05;
      targetRotationY += (mouseX - targetRotationY) * 0.05;

      cyberGroup.rotation.y = elapsedTime * 0.15 + targetRotationY * 2;
      cyberGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + targetRotationX * 2;

      // Independent rotations for inner elements
      coreMesh.rotation.y = -elapsedTime * 0.25;
      coreMesh.rotation.z = elapsedTime * 0.18;

      innerMesh.rotation.x = elapsedTime * 0.4;
      innerMesh.rotation.y = elapsedTime * 0.35;

      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.y = -elapsedTime * 0.18;

      // Pulse core scale subtly
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
      coreMesh.scale.set(scale, scale, scale);

      // Animate particles & update connections
      const positions = particleGeometry.attributes.position.array as Float32Array;
      let lineIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        // Move particle by velocity
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Bounce back if out of radius
        const dist = Math.sqrt(
          positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2
        );
        if (dist > maxRadius) {
          particleVelocities[i].negate();
        }

        // Connect nearby nodes with network lines
        for (let j = i + 1; j < particleCount; j++) {
          if (lineIndex >= maxLineConnections * 6) break;

          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 3.2) {
            linePositions[lineIndex++] = positions[i * 3];
            linePositions[lineIndex++] = positions[i * 3 + 1];
            linePositions[lineIndex++] = positions[i * 3 + 2];

            linePositions[lineIndex++] = positions[j * 3];
            linePositions[lineIndex++] = positions[j * 3 + 1];
            linePositions[lineIndex++] = positions[j * 3 + 2];
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // Render initial frame and start animation immediately
    renderer.render(scene, camera);
    animate();

    // IntersectionObserver to pause rendering when hero section is scrolled out of view
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && currentMount) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              if (pauseStart > 0) {
                pausedTime += performance.now() - pauseStart;
                pauseStart = 0;
              }
              animate();
            }
          } else {
            if (isVisible) {
              isVisible = false;
              pauseStart = performance.now();
              cancelAnimationFrame(animationFrameId);
            }
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(currentMount);
    }

    // Clean up
    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      if (currentMount && renderer.domElement && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      particleTexture.dispose();
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
}
