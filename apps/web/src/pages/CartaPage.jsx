import React, { useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const pages = Array.from({ length: 19 }, (_, i) => `/carta-${i + 1}.png`);

const CartaPage = () => {
  const bookRef = useRef(null);
  const [page, setPage] = useState(0);

  const onFlip = (e) => setPage(e.data);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8 select-none">
      <img
        src="/logo-valookie.png"
        alt="Valookie"
        className="h-14 w-auto mb-8 brightness-0 invert"
      />

      <div className="w-full flex items-center justify-center gap-4">
        {/* Prev */}
        <button
          onClick={() => bookRef.current?.pageFlip().flipPrev()}
          className="text-white/50 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Flipbook */}
        <HTMLFlipBook
          ref={bookRef}
          width={340}
          height={480}
          size="fixed"
          minWidth={200}
          maxWidth={600}
          minHeight={300}
          maxHeight={800}
          showCover={false}
          flippingTime={700}
          usePortrait={true}
          startPage={0}
          drawShadow={true}
          autoSize={true}
          onFlip={onFlip}
          className="shadow-2xl"
        >
          {pages.map((src, i) => (
            <div key={i} className="bg-white">
              <img
                src={src}
                alt={`Página ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </HTMLFlipBook>

        {/* Next */}
        <button
          onClick={() => bookRef.current?.pageFlip().flipNext()}
          className="text-white/50 hover:text-white transition-colors p-2"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-8">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => bookRef.current?.pageFlip().flip(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === page ? 'bg-white scale-125' : 'bg-white/30'}`}
          />
        ))}
      </div>

      <p className="text-white/40 text-xs mt-3">{page + 1} / {pages.length}</p>
    </div>
  );
};

export default CartaPage;
