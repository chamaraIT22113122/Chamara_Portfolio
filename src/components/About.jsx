import React from 'react';
import { aboutData, interestsData } from '../data/portfolioData';

const About = () => {
  return (
    <section id="about" className="about">
      {/* ======= About Me ======= */}
      <div className="about-me container">
        <div className="social-links"></div>
        <div className="section-title">
          <h2>About</h2>
        </div>
        
        <div className="row">
          <div className="col-lg-4" data-aos="fade-right">
            <img src="dp.jpg" className="img-fluid" alt="Profile" />
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content" data-aos="fade-left"><br />
            <p>{aboutData.description}</p>
            <br /><br />
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  {aboutData.details.left.map((item, index) => (
                    <li key={index}><i className="icofont-rounded-right"></i> <strong>{item.label}:</strong> {item.value}</li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  {aboutData.details.right.map((item, index) => (
                    <li key={index}><i className="icofont-rounded-right"></i> <strong>{item.label}:</strong> {item.value}</li>
                  ))}
                </ul>
              </div>
              <div className="upbutton" style={{ textAlign: 'right' }}></div>
              <a href="Vcard.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Vcard</a>
            </div>
          </div>
        </div>
      </div>{/* End About Me */}

      {/* ======= Interests ======= */}
      <div className="interests container">
        <div className="section-title">
          <h2>Interests</h2>
        </div>
      
        <div className="row">
          {interestsData.map(interest => (
            <div key={interest.id} className="col-lg-3 col-md-4 mt-4 mt-md-0" style={interest.id > 1 ? { marginTop: '24px' } : {}}>
              <div className="icon-box">
                <i className={interest.icon} style={{ color: interest.color }}></i>
                <h3>{interest.title}</h3>
                <ul>
                  {interest.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>{/* End Interests */}
    </section>
  );
};

export default About;
