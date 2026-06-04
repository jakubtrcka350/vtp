import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref and a boolean that becomes true when the element enters the viewport.
 * Fires only once (disconnects after first intersection).
 * Immediately returns true if the user prefers reduced motion — no hidden state.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  // Respect prefers-reduced-motion — skip animation entirely
  const [inView, setInView] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (inView) return; // already visible or reduced motion
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      // rootMargin pushes the trigger point 18% above the bottom of the viewport —
      // so elements only animate once they're clearly visible, not just peeking in.
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, options]);

  return { ref, inView };
}
