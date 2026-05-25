import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const pages = ['/carta-1.png', '/carta-2.png', '/carta-3.png', '/carta-4.png'];

const CartaPage = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => Math.max(0, i - 1));
  const next = () => setCurrent(i => Math.min(pages.length - 1, i + 1));

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <img
        src="/logo-valookie.png"
        alt="Valookie"
        className="h-16 w-auto mb-6 brightness-0 invert"
      />

      <div className="relative w-full max-w-2xl">
        <img
          key={current}
          src={pages[current]}
          alt={`Carta página ${current + 1}`}
          className="w-full rounded-2xl shadow-2xl"
        />

        {/* Prev */}
        {current > 0 && (
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next */}
        {current < pages.length - 1 && (
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-6">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
          />
        ))}
      </div>

      <p className="text-white/50 text-xs mt-4">{current + 1} / {pages.length}</p>
    </div>
  );
};

export default CartaPage;
