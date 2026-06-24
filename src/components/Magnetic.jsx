import React, { useEffect, useRef } from 'react';

const Magnetic = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onMouseMove = (e) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      if (distance < width * 2) {
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      } else {
        element.style.transform = `translate(0px, 0px)`;
      }
    };

    const onMouseLeave = () => {
      element.style.transform = `translate(0px, 0px)`;
    };

    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Pass ref down to the child component
  return React.cloneElement(children, { ref, className: `${children.props.className || ''} magnetic-element` });
};

export default Magnetic;
