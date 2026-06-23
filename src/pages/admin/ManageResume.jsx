import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/uploadImage';

const ManageResume = () => {
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const docRef = doc(db, 'settings', 'resume');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentResume(docSnap.data().url);
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Please select a file to upload.');
      return;
    }

    setUploading(true);
    try {
      // Upload file to Firebase Storage
      const fileUrl = await uploadImage(file);
      
      // Save URL to Firestore
      await setDoc(doc(db, 'settings', 'resume'), { url: fileUrl });
      
      setCurrentResume(fileUrl);
      setFile(null);
      
      // Reset input
      const fileInput = document.getElementById('resumeFileInput');
      if (fileInput) fileInput.value = '';
      
      toast.success('Resume updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>Manage Resume</h2>
      
      <div style={{ backgroundColor: '#1f2029', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h4 style={{ color: '#fff', marginBottom: '15px' }}>Current Resume</h4>
        {loading ? (
          <p style={{ color: '#ccc' }}>Loading...</p>
        ) : currentResume ? (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <a 
                href={currentResume} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#149ddd', textDecoration: 'underline', fontSize: '16px' }}
              >
                <i className="bx bx-link-external"></i> Open Resume in New Tab
              </a>
            </div>
            <div style={{ width: '100%', height: '500px', border: '1px solid #444', borderRadius: '4px', overflow: 'hidden' }}>
              <iframe 
                src={currentResume} 
                width="100%" 
                height="100%" 
                title="Current Resume Preview"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        ) : (
          <p style={{ color: '#ccc' }}>No resume uploaded yet.</p>
        )}
      </div>

      <div style={{ backgroundColor: '#1f2029', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ color: '#fff', marginBottom: '15px' }}>Upload New Resume</h4>
        <form onSubmit={handleUpload}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '10px' }}>Select File (PDF, DOCX)</label>
            <input 
              id="resumeFileInput"
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ color: '#fff', width: '100%' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              backgroundColor: '#149ddd', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? 'Uploading...' : 'Update Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageResume;
