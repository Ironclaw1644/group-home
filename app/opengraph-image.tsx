import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#f5f1ea 0%,#dff8f5 45%,#c9ebee 100%)',
          padding: 48,
          color: '#0f2d45'
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, color: '#0c9ea6' }}>AT HOME FAMILY SERVICES, LLC</div>
        <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>
          Warm, supportive living for adults with developmental disabilities
        </div>
        <div style={{ fontSize: 28 }}>North Chesterfield, VA • Placement Inquiries • Tours</div>
      </div>
    ),
    size
  );
}
