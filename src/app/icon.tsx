import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07090e',
          borderRadius: '8px',
          border: '1.5px solid #00f2fe',
          boxShadow: '0 0 10px rgba(0, 242, 254, 0.8)',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '20px',
            color: '#00f2fe',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          D
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
