import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const Experience = () => {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'experience'), (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setExperienceList(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching experience: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="experience" className="services">
      <div className="container">
        <div className="section-title" style={{ textAlign: 'left' }}>
          <h2>Experience</h2>
        </div>
        <div className="row">
          {loading ? (
            <div className="col-12 text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : experienceList.length === 0 ? (
            <div className="col-12"><p>No experience data found. Please add some from the Admin Dashboard.</p></div>
          ) : (
            experienceList.map((exp, index) => (
              <div key={exp.id} className="col-lg-12" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="experience-item icon-box glass-panel" style={{ textAlign: 'left', padding: '25px', marginBottom: '20px' }}>
                  <h4>
                    <span style={{ color: '#12d640' }}>{exp.company}</span>
                  </h4>
                  <h5>{exp.years}</h5>
                  <p><em>{exp.title}</em></p>
                  <div style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: exp.description || '' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
