import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/uploadImage';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', years: '', institution: '', description: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const educationCollectionRef = collection(db, 'education');

  useEffect(() => {
    const unsubscribe = onSnapshot(educationCollectionRef, (querySnapshot) => {
      setEducation(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching education: ", error);
      toast.error('Failed to fetch education');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'education');
      }

      const eduData = {
        title: formData.title,
        years: formData.years,
        institution: formData.institution,
        description: formData.description,
        imageUrl: imageUrl || ''
      };

      if (isEditing) {
        const eduDoc = doc(db, 'education', editId);
        await updateDoc(eduDoc, eduData);
        toast.success('Education updated successfully!');
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(educationCollectionRef, eduData);
        toast.success('Education added successfully!');
      }
      
      setFormData({ title: '', years: '', institution: '', description: '', imageUrl: '' });
      setImageFile(null);
      document.getElementById('eduForm').reset();
    } catch (err) {
      toast.error('Failed to save education');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (edu) => {
    setIsEditing(true);
    setEditId(edu.id);
    setFormData({ title: edu.title, years: edu.years, institution: edu.institution, description: edu.description, imageUrl: edu.imageUrl || '' });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      try {
        const eduDoc = doc(db, 'education', id);
        await deleteDoc(eduDoc);
        toast.success('Education deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete education');
      }
    }
  };

  const resolveImagePath = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) return path;
    return '/' + path;
  };

  return (
    <div>
      <h2 className="mb-4">Manage Education</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEditing ? 'Edit Education' : 'Add New Education'}</h4>
        </div>
        <div className="card-body">
          <form id="eduForm" onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Degree / Title</label>
              <input type="text" className="form-control" name="title" placeholder="e.g. B.Sc. in Computer Science" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Years</label>
              <input type="text" className="form-control" name="years" placeholder="e.g. 2020 - 2024" value={formData.years} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Institution</label>
              <input type="text" className="form-control" name="institution" placeholder="e.g. University of Example" value={formData.institution} onChange={handleChange} required />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Upload Institution Logo (Optional)</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              {formData.imageUrl && <img src={formData.imageUrl} alt="Logo" className="img-thumbnail mt-2" style={{ maxHeight: '50px' }} />}
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description / Coursework</label>
              <ReactQuill theme="snow" value={formData.description} onChange={(content) => setFormData({ ...formData, description: content })} style={{ backgroundColor: 'white' }} />
            </div>
            
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary me-2" disabled={uploading}>
                {uploading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                ) : (
                  isEditing ? 'Update Education' : 'Add Education'
                )}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => { 
                  setIsEditing(false); 
                  setFormData({ title: '', years: '', institution: '', description: '', imageUrl: '' });
                  setImageFile(null);
                  document.getElementById('eduForm').reset();
                }} disabled={uploading}>
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
                <th>Logo</th>
                <th>Title</th>
                <th>Institution</th>
                <th>Years</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {education.map((edu) => {
                const imgUrl = resolveImagePath(edu.imageUrl);
                return (
                <tr key={edu.id}>
                  <td className="align-middle">
                    {imgUrl ? <img src={imgUrl} alt="icon" style={{ width: '40px', height: '40px', objectFit: 'contain' }} /> : 'No icon'}
                  </td>
                  <td className="align-middle">{edu.title}</td>
                  <td className="align-middle">{edu.institution}</td>
                  <td className="align-middle">{edu.years}</td>
                  <td className="align-middle">
                    <button onClick={() => handleEdit(edu)} className="btn btn-sm btn-warning me-2">Edit</button>
                    <button onClick={() => handleDelete(edu.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
                );
              })}
              {education.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">No education found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEducation;
