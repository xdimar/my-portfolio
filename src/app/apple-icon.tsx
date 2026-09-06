import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #07090e 0%, #0e1626 100%)',
          borderRadius: '36px',
          border: '4px solid #00f2fe',
          boxShadow: '0 0 30px rgba(0, 242, 254, 0.6)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '108px',
            color: '#00f2fe',
            lineHeight: 1,
          }}
        >
          D
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '16px',
            color: '#34d399',
            marginTop: '4px',
            letterSpacing: '2px',
          }}
        >
          TKJ &bull; DEV
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
