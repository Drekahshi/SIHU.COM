'use client';

import { useEffect, useState } from 'react';

interface Props {
  triggerCount: number;
}

export default function HeartAnimation({ triggerCount }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerCount === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [triggerCount]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <span className="text-6xl animate-[heartpop_0.9s_ease-in-out_forwards]">❤️</span>
    </div>
  );
}
