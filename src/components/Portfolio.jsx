import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioFilters } from '../data/portfolioData';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { resolveImagePath } from '../utils/resolveImage';
import { useAnimeReveal } from '../hooks/useAnimeReveal';

const Portfolio = () => {
  const filtersRef = useAnimeReveal();
  const [filter, setFilter] = useState('*');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAllProjects(data);
      setFilteredProjects(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filter === '*') {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter(project => project.category === filter));
    }
  }, [filter, allProjects]);

  useEffect(() => {
    // Re-initialize venobox after items update so new items can be clicked
    if (window.jQuery && window.jQuery().venobox) {
      window.jQuery('.venobox').venobox();
    }
  }, [filteredProjects]);

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <div className="section-title">
          <h2>Projects</h2>
        </div>

        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center" ref={filtersRef}>
            <ul id="portfolio-flters">
              {portfolioFilters.map(item => (
                <li
                  key={item.filter}
                  onClick={() => setFilter(item.filter)}
                  className={filter === item.filter ? 'filter-active' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div layout className="row portfolio-container">
          <AnimatePresence>
            {filteredProjects.map(project => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className={`col-lg-4 col-md-6 portfolio-item ${project.category.replace('.', '')}`}
              >
                <div className="portfolio-wrap glass-panel">
                  <img src={resolveImagePath(project.image || (project.images && project.images[0]))} className="img-fluid" alt={project.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                  <div className="portfolio-info">
                    <h3 className="text-center">{project.title}</h3>
                    <div className="portfolio-links">
                      {project.category === '.filter-graphic' && project.images && project.images.length > 0 ? (
                        <>
                          <a href={resolveImagePath(project.images[0])} data-gall={`gallery-${project.id}`} className="venobox" title={project.title}>
                            <i className="bx bx-plus"></i>
                          </a>
                          {/* Hidden anchor tags for the rest of the images in the gallery */}
                          {project.images.slice(1).map((imgUrl, idx) => (
                            <a key={idx} href={resolveImagePath(imgUrl)} data-gall={`gallery-${project.id}`} className="venobox" style={{ display: 'none' }} title={`${project.title} - Image ${idx + 2}`}></a>
                          ))}
                        </>
                      ) : (
                        <a href={project.link} data-gall="portfolioDetailsGallery" data-vbtype="iframe" className="venobox" title="Project Details">
                          <i className="bx bx-link"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
