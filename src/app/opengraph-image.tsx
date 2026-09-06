import { ImageResponse } from 'next/og';

export const alt = 'Muhammad Jihan Dimar | Portfolio 3D - Fullstack Web Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #07090e 0%, #0d1424 50%, #07090e 100%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          border: '3px solid rgba(0, 242, 254, 0.4)',
          position: 'relative',
        }}
      >
        {/* Ambient glow in background */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157, 78, 221, 0.25) 0%, transparent 70%)',
          }}
        />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'monospace',
              fontSize: '24px',
              fontWeight: 700,
              color: '#f8fafc',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#00f2fe',
                boxShadow: '0 0 15px #00f2fe',
              }}
            />
            <span>DIMAR</span>
            <span style={{ color: '#00f2fe' }}>.DEV</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              color: '#34d399',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            <span>● TKJ 2021 ALUMNUS</span>
          </div>
        </div>

        {/* Center Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10 }}>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#38bdf8',
              fontFamily: 'monospace',
              letterSpacing: '2px',
            }}
          >
            [INTERACTIVE 3D WEB PORTFOLIO]
          </span>

          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-1px',
            }}
          >
            MUHAMMAD JIHAN DIMAR
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Fullstack Web Developer &bull; Frontend, Backend &amp; Jaringan Sistem
          </p>
        </div>

        {/* Bottom Tech Pills and Domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Next.js 15', 'Three.js 3D', 'React 19', 'Node.js', 'PostgreSQL', 'Linux Server'].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <span
            style={{
              color: '#00f2fe',
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            https://dimar.dev
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
