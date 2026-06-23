import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import app from '../../firebase/config';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';

import ManageProjects from './ManageProjects';
import ManageEducation from './ManageEducation';
import ManageExperience from './ManageExperience';
import ManageSkills from './ManageSkills';
import ManageMessages from './ManageMessages';
import ManageResume from './ManageResume';
import AdminHome from './AdminHome';
import AdminSettings from './AdminSettings';

const AdminDashboard = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Projects', path: '/admin/projects' },
    { name: 'Skills', path: '/admin/skills' },
    { name: 'Education', path: '/admin/education' },
    { name: 'Experience', path: '/admin/experience' },
    { name: 'Resume', path: '/admin/resume' },
    { name: 'Messages', path: '/admin/messages' },
    { name: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 9999, display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#040b14', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #149ddd' }}>
          Admin Panel
        </div>
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  style={{ 
                    display: 'block', 
                    padding: '15px 20px', 
                    color: location.pathname === item.path ? '#149ddd' : '#a8a9b4',
                    textDecoration: 'none',
                    backgroundColor: location.pathname === item.path ? '#212431' : 'transparent',
                    borderLeft: location.pathname === item.path ? '4px solid #149ddd' : '4px solid transparent',
                    transition: '0.3s'
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ padding: '20px' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <div style={{ backgroundColor: '#fff', color: '#333', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minHeight: '500px' }}>
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/projects" element={<ManageProjects />} />
            <Route path="/skills" element={<ManageSkills />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="experience" element={<ManageExperience />} />
            <Route path="resume" element={<ManageResume />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
