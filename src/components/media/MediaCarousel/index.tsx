'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeartAnimation from '@/components/media/HeartAnimation';
import type { MediaPost } from '@/lib/media/mockData';

interface Props {
  post: MediaPost;
  aspectRatio?: string;
  sizes?: string;
  initialIndex?: number;
  onIndexChange?: (i: number) => void;
  onDoubleClick?: () => void;
  onClick?: () => void;
  objectFit?: 'cover' | 'contain';
  dotsBelow?: boolean;
}

export default function MediaCarousel({
  post,
  aspectRatio,
  sizes = '(max-width: 768px) 100vw, 468px',
  initialIndex = 0,
  onIndexChange,
  onDoubleClick,
  onClick,
  objectFit = 'cover',
  dotsBelow = false,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [heartCount, setHeartCount] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const didSwipe = useRef(false);

  const media = post.images;
  const total = media.length;
  const current = media[index];

  const navigate = (next: number) => {
    setIndex(next);
    onIndexChange?.(next);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    didSwipe.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    didSwipe.current = true;
    if (dx < 0 && index < total - 1) navigate(index + 1);
    else if (dx > 0 && index > 0) navigate(index - 1);
  };

  const handleClick = () => {
    if (didSwipe.current) return;
    onClick?.();
  };

  const handleDoubleClick = () => {
    onDoubleClick?.();
    setHeartCount(c => c + 1);
  };

  if (!current) return null;

  return (
    <div className="flex flex-col">
      <div
        className="relative w-full overflow-hidden rounded-none bg-slate-100"
        style={{ aspectRatio }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${index * 100}%)`, width: `${total * 100}%` }}
        >
          {media.map((img, i) => (
            <div
              key={img.id}
              className="relative flex-shrink-0"
              style={{ width: `${100 / total}%`, aspectRatio }}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
            >
              <Image
                src={img.url}
                alt={img.alt_text}
                fill
                sizes={sizes}
                className={`${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <HeartAnimation triggerCount={heartCount} />

        {total > 1 && index > 0 && (
          <button
            onClick={() => navigate(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-800" />
          </button>
        )}
        {total > 1 && index < total - 1 && (
          <button
            onClick={() => navigate(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight size={18} className="text-slate-800" />
          </button>
        )}

        {total > 1 && !dotsBelow && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {total > 1 && dotsBelow && (
        <div className="flex justify-center gap-1.5 pt-2">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-slate-900' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
