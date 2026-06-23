import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    education: 0,
    experience: 0,
    messagesTotal: 0,
    messagesUnread: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup listeners for all collections to get counts
    const unsubs = [];

    unsubs.push(onSnapshot(collection(db, 'projects'), (snap) => {
      setStats(prev => ({ ...prev, projects: snap.size }));
    }));

    unsubs.push(onSnapshot(collection(db, 'skills'), (snap) => {
      setStats(prev => ({ ...prev, skills: snap.size }));
    }));

    unsubs.push(onSnapshot(collection(db, 'education'), (snap) => {
      setStats(prev => ({ ...prev, education: snap.size }));
    }));

    unsubs.push(onSnapshot(collection(db, 'experience'), (snap) => {
      setStats(prev => ({ ...prev, experience: snap.size }));
    }));

    unsubs.push(onSnapshot(collection(db, 'messages'), (snap) => {
      let unreadCount = 0;
      snap.forEach(doc => {
        if (!doc.data().read) unreadCount++;
      });
      setStats(prev => ({ ...prev, messagesTotal: snap.size, messagesUnread: unreadCount }));
      setLoading(false); // Assume done when messages load
    }));

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <div className="row g-4">
        {/* Messages Card */}
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3 shadow-sm h-100">
            <div className="card-header border-0 pb-0"><i className="bx bx-envelope fs-4"></i></div>
            <div className="card-body">
              <h5 className="card-title">Messages</h5>
              <h2 className="display-4 fw-bold mb-0">{stats.messagesTotal}</h2>
              <p className="card-text">Total received</p>
            </div>
            {stats.messagesUnread > 0 && (
              <div className="card-footer bg-transparent border-top-0 pt-0">
                <span className="badge bg-warning text-dark">{stats.messagesUnread} Unread</span>
              </div>
            )}
          </div>
        </div>

        {/* Projects Card */}
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3 shadow-sm h-100">
            <div className="card-header border-0 pb-0"><i className="bx bx-briefcase fs-4"></i></div>
            <div className="card-body">
              <h5 className="card-title">Projects</h5>
              <h2 className="display-4 fw-bold mb-0">{stats.projects}</h2>
              <p className="card-text">Showcased portfolio items</p>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3 shadow-sm h-100">
            <div className="card-header border-0 pb-0"><i className="bx bx-code-alt fs-4"></i></div>
            <div className="card-body">
              <h5 className="card-title">Skills</h5>
              <h2 className="display-4 fw-bold mb-0">{stats.skills}</h2>
              <p className="card-text">Tracked proficiencies</p>
            </div>
          </div>
        </div>

        {/* Experience Card */}
        <div className="col-md-6">
          <div className="card text-dark bg-light mb-3 shadow-sm h-100 border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3 text-primary">
                <i className="bx bx-buildings" style={{ fontSize: '3rem' }}></i>
              </div>
              <div>
                <h5 className="card-title text-muted mb-0">Experience Timeline</h5>
                <h3 className="mb-0 fw-bold">{stats.experience} Roles</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Education Card */}
        <div className="col-md-6">
          <div className="card text-dark bg-light mb-3 shadow-sm h-100 border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3 text-primary">
                <i className="bx bxs-graduation" style={{ fontSize: '3rem' }}></i>
              </div>
              <div>
                <h5 className="card-title text-muted mb-0">Education History</h5>
                <h3 className="mb-0 fw-bold">{stats.education} Degrees</h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;
