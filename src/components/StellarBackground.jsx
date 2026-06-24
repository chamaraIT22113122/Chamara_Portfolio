import React, { useEffect, useRef } from 'react';

const StellarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];

    // For mouse parallax
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Adjust density based on screen size for performance
      const numStars = Math.floor((canvas.width * canvas.height) / 1500); 
      
      for (let i = 0; i < numStars; i++) {
        // Create 3 layers for parallax depth
        // Layer 1 is background (smallest, slowest), Layer 3 is foreground
        const layer = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 2 : 3; 
        
        stars.push({
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
          radius: (Math.random() * 1.2 + 0.3) * (layer * 0.5),
          baseAlpha: Math.random() * 0.4 + 0.1,
          alpha: Math.random() * 0.4 + 0.1,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          layer: layer, 
          color: Math.random() > 0.8 ? 'rgba(200, 220, 255,' : 'rgba(255, 255, 255,' 
        });
      }
    };

    const onMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Smooth mouse interpolation (ease)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Calculate mouse offset from center
      const offsetX = (mouseX - canvas.width / 2) * 0.04;
      const offsetY = (mouseY - canvas.height / 2) * 0.04;

      stars.forEach(star => {
        // Twinkling effect
        star.alpha += star.pulseSpeed;
        if (star.alpha <= star.baseAlpha * 0.3 || star.alpha >= Math.min(1, star.baseAlpha * 2.5)) {
          star.pulseSpeed = -star.pulseSpeed;
        }
        
        // Gentle drift upwards to create a sense of moving through space
        star.originalY -= 0.15 * star.layer;
        
        // Wrap around when moving out of bounds
        if (star.originalY < -50) {
          star.originalY = canvas.height + 50;
          star.originalX = Math.random() * canvas.width;
        }

        // Parallax offset applied
        const currentX = star.originalX - (offsetX * star.layer);
        const currentY = star.originalY - (offsetY * star.layer);

        // Draw star
        ctx.beginPath();
        ctx.arc(currentX, currentY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${Math.abs(star.alpha)})`;
        
        // Only glow foreground stars to maintain high FPS performance
        if (star.layer === 3) {
          ctx.shadowBlur = star.radius * 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    
    resize();
    drawStars();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default StellarBackground;
