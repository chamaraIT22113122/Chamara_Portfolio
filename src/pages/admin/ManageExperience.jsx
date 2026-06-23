import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ManageExperience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', years: '', company: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const experienceCollectionRef = collection(db, 'experience');

  useEffect(() => {
    const unsubscribe = onSnapshot(experienceCollectionRef, (querySnapshot) => {
      setExperience(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching experience: ", error);
      toast.error('Failed to fetch experience');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const expDoc = doc(db, 'experience', editId);
        await updateDoc(expDoc, formData);
        toast.success('Experience updated successfully!');
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(experienceCollectionRef, formData);
        toast.success('Experience added successfully!');
      }
      setFormData({ title: '', years: '', company: '', description: '' });
    } catch (err) {
      toast.error('Failed to save experience');
    }
  };

  const handleEdit = (exp) => {
    setIsEditing(true);
    setEditId(exp.id);
    setFormData({ title: exp.title, years: exp.years, company: exp.company, description: exp.description });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        const expDoc = doc(db, 'experience', id);
        await deleteDoc(expDoc);
        toast.success('Experience deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete experience');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Experience</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEditing ? 'Edit Experience' : 'Add New Experience'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Job Title</label>
              <input type="text" className="form-control" name="title" placeholder="e.g. Senior Developer" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Years</label>
              <input type="text" className="form-control" name="years" placeholder="e.g. 2021 - Present" value={formData.years} onChange={handleChange} required />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Company</label>
              <input type="text" className="form-control" name="company" placeholder="e.g. Tech Corp" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description / Responsibilities</label>
              <ReactQuill theme="snow" value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} style={{ backgroundColor: 'white' }} />
            </div>
            
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary me-2">
                {isEditing ? 'Update Experience' : 'Add Experience'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData({ title: '', years: '', company: '', description: '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover table-striped mb-0">
            <thead className="table-dark">
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Years</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experience.map((exp) => (
                <tr key={exp.id}>
                  <td className="align-middle">{exp.title}</td>
                  <td className="align-middle">{exp.company}</td>
                  <td className="align-middle">{exp.years}</td>
                  <td className="align-middle">
                    <button onClick={() => handleEdit(exp)} className="btn btn-sm btn-warning me-2">Edit</button>
                    <button onClick={() => handleDelete(exp.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {experience.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">No experience found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageExperience;
