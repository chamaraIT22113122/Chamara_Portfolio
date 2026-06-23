import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { resolveImagePath } from '../utils/resolveImage';

const Header = () => {
  const [resumeUrl, setResumeUrl] = useState('https://drive.google.com/file/d/1Xw7PZjy3yXD_wo_YKTA7428sq6h_7cB0/view?usp=sharing');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'resume'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().url) {
        setResumeUrl(docSnap.data().url);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <header id="header" className="header-tops">
      <div className="container">
        <div className="home-avatar-container" style={{ marginBottom: '25px', display: 'flex' }}>
          <img 
            src={resolveImagePath('dp.jpg')} 
            alt="TCN Bandara" 
            style={{ 
              width: '160px', 
              height: '160px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(18, 214, 64, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              zIndex: 10
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 30px rgba(18, 214, 64, 0.4)';
              e.currentTarget.style.border = '3px solid rgba(18, 214, 64, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(18, 214, 64, 0.2)';
              e.currentTarget.style.border = '3px solid rgba(255, 255, 255, 0.15)';
            }}
          />
        </div>
        <h1><a href="index.html">TCN Bandara</a></h1>
        <h2 style={{ color: '#fff' }}>
          I'm a <span className="typing" style={{ color: '#12D640' }}></span>
        </h2>
        <nav className="nav-menu d-none d-lg-block">
          <ul>
            <li className="active"><a href="#header"> <span>Home</span></a></li>
            <li><a href="#about"><span>About</span></a></li>
            <li><a href="#education"> <span>Education</span></a></li>
            <li><a href="#experience"> <span>Experience</span></a></li>
            <li><a href="#portfolio"> <span>Projects</span></a></li>
            <li><a href="#skills"> <span>Skills</span></a></li>
            <li><a href={resumeUrl} target="_blank" rel="noopener noreferrer"> <span>Resume</span></a></li>
            <li><a href="#contacts"> <span>Contact</span></a></li>
            <li>
              <a href="#/login" style={{ opacity: 0.2, cursor: 'pointer', fontSize: '14px', paddingLeft: '5px' }} title="Admin Login">
                <i className="bx bx-lock"></i>
              </a>
            </li>
          </ul>
        </nav>

        <div className="social-links">
          <a href="https://www.linkedin.com/in/chamara-nuwan-032a35323" target="_blank" rel="noopener noreferrer" className="linkedin"><i className="bx bxl-linkedin"></i></a>
          <a href="https://github.com/chamaraIT22113122" target="_blank" rel="noopener noreferrer" className="github"><i className="bx bxl-github"></i></a>
          <a href="mailto:cn1120693@gmail.com" target="_blank" rel="noopener noreferrer" className="google"><i className="bx bxl-google"></i></a>
          <a href="https://www.instagram.com/Cha__m_a" target="_blank" rel="noopener noreferrer" className="instagram"><i className="bx bxl-instagram"></i></a>
          <a href="https://www.facebook.com/chamara.nuwan.332345" target="_blank" rel="noopener noreferrer" className="facebook"><i className="bx bxl-facebook"></i></a>
          <a href="https://wa.me/+94702481691" target="_blank" rel="noopener noreferrer" className="whatsapp"><i className="bx bxl-whatsapp"></i></a>
        </div>
      </div>
    </header>
  );
};

export default Header;
