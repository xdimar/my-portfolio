'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './HoloCard.module.css';
import { soundFx } from '@/utils/audio';

interface HoloCardProps {
  imageUrl?: string;
  name?: string;
  callName?: string;
  gradYear?: string;
}

export default function HoloCard({
  imageUrl = '/images/dimar.jpg',
  name = 'Muhammad Jihan Dimar',
  callName = 'Dimar',
  gradYear = '2021',
}: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [shineOpacity, setShineOpacity] = useState<number>(0);
  const [shineGradient, setShineGradient] = useState<string>('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-12 to 12 deg)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);

    // Holographic shine gradient position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setShineGradient(`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(0, 242, 254, 0.4) 0%, rgba(157, 78, 221, 0.25) 30%, transparent 70%)`);
    setShineOpacity(0.85);
  };

  const handleMouseEnter = () => {
    soundFx.playHover();
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setShineOpacity(0);
  };

  return (
    <div className={styles.cardContainer}>
      <div
        ref={cardRef}
        className={styles.cardInner}
        style={{ transform: transformStyle }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hologram shine overlay */}
        <div
          className={styles.hologramShine}
          style={{
            background: shineGradient,
            opacity: shineOpacity,
          }}
        />

        {/* Cyber corner brackets */}
        <div className={styles.techCornerTL} />
        <div className={styles.techCornerTR} />
        <div className={styles.techCornerBL} />
        <div className={styles.techCornerBR} />

        {/* Photo Container */}
        <div className={styles.photoWrapper}>
          <Image
            src={imageUrl || '/images/dimar.jpg'}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            priority
            className={styles.photoImg}
          />
          <div className={styles.photoGradient} />
        </div>

        {/* Card Content */}
        <div className={styles.cardContent}>
          <div className={styles.statusRow}>
            <span className={styles.statusPill}>
              <span className="status-dot" /> AVAILABLE FOR HIRE
            </span>
            <span className={styles.alumniBadge}>TKJ {gradYear}</span>
          </div>

          <h3 className={styles.nameHeading}>{name}</h3>
          <p className={styles.nickCallout}>@{callName} • Fullstack Engineer</p>

          <div className={styles.roleTags}>
            <span className={styles.roleTag}>⚡ Frontend</span>
            <span className={styles.roleTag}>🛡️ Backend</span>
            <span className={styles.roleTag}>🌐 Networking</span>
            <span className={styles.roleTag}>✨ Next.js</span>
          </div>
        </div>

        {/* Animated bottom beam */}
        <div className={styles.bottomBorderPulse} />
      </div>
    </div>
  );
}
