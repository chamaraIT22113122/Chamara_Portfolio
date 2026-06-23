import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { resolveImagePath } from '../utils/resolveImage';

const Education = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'education'), (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEducationList(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching education: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getImageForInstitution = (institution) => {
    const inst = institution?.toLowerCase() || '';
    if (inst.includes('school')) return 'assets/img/education/GCE.jpg';
    if (inst.includes('idm')) return 'assets/img/education/IDM.jpg';
    if (inst.includes('sliit')) return 'assets/img/education/SLIIT.jpg';
    if (inst.includes('microsoft')) return 'assets/img/education/Limi.png';
    if (inst.includes('google')) return 'assets/img/education/google.png';
    if (inst.includes('mo')) return 'assets/img/education/MO.jpg';
    if (inst.includes('oracle')) return 'assets/img/education/Oracal.jpg';
    return 'assets/img/education/au.png'; // fallback image
  };

  return (
    <section id="education" className="services">
      <div className="container">
        <div className="section-title">
          <h2>Education</h2>
        </div>
        <div className="row">
          
          {loading ? (
            <div className="col-12 text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : educationList.length === 0 ? (
            <div className="col-12"><p style={{color: '#fff'}}>No education data found. Please add some from the Admin Dashboard.</p></div>
          ) : (
            educationList.map((edu, index) => (
              <div key={edu.id} className="col-lg-6 col-md-6 mb-4">
                <div className="education-card glass-panel" data-aos="fade-up" data-aos-delay={index * 100} style={{ padding: '20px', marginBottom: '20px' }}>
                  <img 
                    src={resolveImagePath(edu.imageUrl || getImageForInstitution(edu.institution))} 
                    className="education-img img-fluid" 
                    alt={`${edu.institution} Logo`} 
                  />
                  <div className="education-content">
                    <p><em>{edu.title}</em></p>
                    <h5>{edu.years}</h5>
                    <h6>Relevant Coursework</h6>
                    <div dangerouslySetInnerHTML={{ __html: edu.description || '' }} />
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default Education;
