import { useEffect } from 'react';

// Pauses every CSS animation inside `ref` while it's scrolled well out of view (class .off-screen, styles/loops.css).
export function usePauseOffscreen(ref) {
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('off-screen', !e.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
}
