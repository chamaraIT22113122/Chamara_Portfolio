import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Portfolio from '../components/Portfolio';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import SEO from '../components/SEO';
import ThemeToggle from '../components/ThemeToggle';

const PortfolioPage = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      // Initialize Typed.js
      if (window.Typed) {
        new window.Typed('.typing', {
          strings: ["Web Developer !", "UI/UX Desinger !","App Developer !", "Graphic Desinger !"],
          loop: true,
          typeSpeed: 65,
          backSpeed: 65
        });
      }

      // Initialize vendor scripts from main.js
      setTimeout(() => {
        if (window.initMain) {
          window.initMain();
        }
      }, 100);
    }
  }, []);

  return (
    <>
      <SEO 
        title="Chamara Portfolio | Web & App Developer"
        description="Personal portfolio of Chamara, a passionate Web Developer, UI/UX Designer, and App Developer."
        keywords="developer, ui/ux, graphic design, web development, app development, react"
      />
      <Header />
      <About />
      <Education />
      <Experience />
      <Portfolio />
      <Skills />
      <Contact />
      <ThemeToggle />
    </>
  );
};

export default PortfolioPage;
