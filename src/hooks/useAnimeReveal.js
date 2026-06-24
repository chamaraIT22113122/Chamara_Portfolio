import { useEffect, useRef } from 'react';
import anime from 'animejs';

export const useAnimeReveal = (options = {}) => {
  const ref = useRef(null);
  const {
    staggerDelay = 100,
    translateY = [50, 0],
    opacity = [0, 1],
    duration = 1000,
    easing = "spring(1, 80, 10, 0)", // high-end organic feel
    selector = "> *" // Animate immediate children by default
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state for all targets to avoid flickering before the animation starts
    const targets = selector === "> *" ? Array.from(element.children) : element.querySelectorAll(selector);
    anime.set(targets, { opacity: 0, translateY: translateY[0] });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animTargets = selector === "> *" ? Array.from(entry.target.children) : entry.target.querySelectorAll(selector);
            anime({
              targets: animTargets,
              translateY,
              opacity,
              duration,
              easing,
              delay: anime.stagger(staggerDelay),
            });
            // Stop observing once animated to avoid re-triggering
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [staggerDelay, translateY, opacity, duration, easing, selector]);

  return ref;
};
