import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { resolveImagePath } from '../utils/resolveImage';
import { useAnimeReveal } from '../hooks/useAnimeReveal';

const Skills = () => {
  const skillsRef = useAnimeReveal();
  const linksRef = useAnimeReveal({ staggerDelay: 150 });
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState('https://drive.google.com/file/d/1Xw7PZjy3yXD_wo_YKTA7428sq6h_7cB0/view?usp=sharing');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'skills'), (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSkillsList(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching skills: ", error);
      setLoading(false);
    });

    const unsubResume = onSnapshot(doc(db, 'settings', 'resume'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().url) {
        setResumeUrl(docSnap.data().url);
      }
    });

    return () => {
      unsubscribe();
      unsubResume();
    };
  }, []);

  const categories = ['Languages and Databases', 'Frameworks', 'Tools', 'Graphic Tools'];

  return (
    <>
      {/* Start Skills Section */}
      <section id="skills" className="services">
        <div className="container">
          <div className="section-title">
            <h2>Skills</h2>
          </div>
          <div className="row">
            <div className="col-lg-12" ref={skillsRef}>
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : skillsList.length === 0 ? (
                <p>No skills found. Please add some from the Admin Dashboard.</p>
              ) : (
                categories.map((category) => {
                  const catSkills = skillsList.filter(s => s.category === category);
                  if (catSkills.length === 0) return null;
                  
                  return (
                    <div key={category} className="col-md-12 mt-4 mt-md-0 icon-box glass-panel" style={{ marginBottom: '20px', padding: '20px' }}>
                      <h4 style={{ textAlign: 'left', color: '#12d640', marginBottom: '15px' }}>{category}</h4>
                      <p style={{ textAlign: 'left', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
                        {catSkills.map(skill => (
                          <img 
                            key={skill.id} 
                            src={resolveImagePath(skill.iconUrl)} 
                            alt={skill.name} 
                            title={skill.name}
                            style={{ height: '50px', objectFit: 'contain', maxWidth: '150px' }} 
                          />
                        ))}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Start Links section */}
      <section id="links" className="services">
        <div className="container">
          <div className="section-title">
            <h2>Resume & Links</h2>
          </div>
          <div className="row" ref={linksRef}>
            <div className="col-md-4 mt-4 mt-md-0 icon-box glass-panel" style={{ padding: '20px' }}>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <div className="icon"><i className="icofont-page"></i></div>
              </a>
              <h4 className="title"><a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#12d640' }}>Resume</a></h4>
              <p className="description" style={{ color: '#fff' }}>The link contains downloadable resume</p>
            </div>
            <div className="col-md-4 mt-4 mt-md-0 icon-box glass-panel" style={{ padding: '20px' }}>
              <a href="https://github.com/rajaprerak/LeetCode_Problems" target="_blank" rel="noopener noreferrer">
                <div className="icon"><i className="icofont-link"></i></div>
              </a>
              <h4 className="title"><a href="https://github.com/rajaprerak/LeetCode_Problems" target="_blank" rel="noopener noreferrer" style={{ color: '#12d640' }}>LeetCode Repository</a></h4>
              <p className="description" style={{ color: '#fff' }}> The github repository contains leetcode problems solution in python.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;
