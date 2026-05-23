import React, { useState } from 'react';

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      {hovered && (
        <div
          style={{
            background: '#1f2937',
            color: '#fff',
            fontSize: '0.875rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.375rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        >
          ¡Escríbenos!
        </div>
      )}
      <a
        href="https://wa.me/34610485979"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '9999px',
          backgroundColor: '#25D366',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          textDecoration: 'none',
        }}
        aria-label="Contactar por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.473 2.027 7.774L0 32l8.469-2.001A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.77-1.856l-.485-.287-5.026 1.187 1.23-4.896-.317-.503A13.267 13.267 0 0 1 2.667 16C2.667 8.637 8.637 2.667 16 2.667S29.333 8.637 29.333 16 23.363 29.333 16 29.333zm7.27-9.987c-.398-.199-2.355-1.162-2.72-1.295-.365-.133-.631-.199-.897.199-.266.398-1.03 1.295-1.263 1.561-.232.266-.465.299-.863.1-.398-.199-1.681-.62-3.202-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.266 0-.697.1-1.063.498-.365.398-1.395 1.362-1.395 3.323 0 1.961 1.428 3.856 1.627 4.122.199.266 2.81 4.291 6.808 6.018.951.411 1.694.656 2.272.84.954.304 1.823.261 2.51.158.766-.114 2.355-.963 2.688-1.893.332-.93.332-1.728.232-1.893-.099-.166-.365-.266-.763-.465z" />
        </svg>
      </a>
    </div>
  );
}

export default WhatsAppButton;
