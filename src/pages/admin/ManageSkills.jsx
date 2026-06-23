import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/uploadImage';
import { resolveImagePath } from '../../utils/resolveImage';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', proficiency: '', imageUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const skillsCollectionRef = collection(db, 'skills');

  useEffect(() => {
    const unsubscribe = onSnapshot(skillsCollectionRef, (querySnapshot) => {
      setSkills(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching skills: ", error);
      toast.error('Failed to fetch skills');
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
        imageUrl = await uploadImage(imageFile, 'skills');
      }

      const skillData = {
        name: formData.name,
        proficiency: formData.proficiency,
        imageUrl: imageUrl || ''
      };

      if (isEditing) {
        const skillDoc = doc(db, 'skills', editId);
        await updateDoc(skillDoc, skillData);
        toast.success('Skill updated successfully!');
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(skillsCollectionRef, skillData);
        toast.success('Skill added successfully!');
      }
      
      setFormData({ name: '', proficiency: '', imageUrl: '' });
      setImageFile(null);
      document.getElementById('skillForm').reset();
    } catch (err) {
      toast.error('Failed to save skill');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (skill) => {
    setIsEditing(true);
    setEditId(skill.id);
    setFormData({ name: skill.name, proficiency: skill.proficiency, imageUrl: skill.imageUrl || '' });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        const skillDoc = doc(db, 'skills', id);
        await deleteDoc(skillDoc);
        toast.success('Skill deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete skill');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Skills</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h4>
        </div>
        <div className="card-body">
          <form id="skillForm" onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4 mb-3">
              <label className="form-label">Skill Name</label>
              <input type="text" className="form-control" name="name" placeholder="e.g. ReactJS" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="col-md-4 mb-3">
              <label className="form-label">Proficiency (%)</label>
              <input type="number" className="form-control" name="proficiency" placeholder="e.g. 85" value={formData.proficiency} onChange={handleChange} required min="0" max="100" />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Upload Icon/Logo (Optional)</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              {formData.imageUrl && <img src={formData.imageUrl} alt="Icon" className="img-thumbnail mt-2" style={{ maxHeight: '50px' }} />}
            </div>
            
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary me-2" disabled={uploading}>
                {uploading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                ) : (
                  isEditing ? 'Update Skill' : 'Add Skill'
                )}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => { 
                  setIsEditing(false); 
                  setFormData({ name: '', proficiency: '', imageUrl: '' });
                  setImageFile(null);
                  document.getElementById('skillForm').reset();
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
                <th>Icon</th>
                <th>Name</th>
                <th>Proficiency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => {
                const imgUrl = resolveImagePath(skill.imageUrl);
                return (
                <tr key={skill.id}>
                  <td className="align-middle">
                    {imgUrl ? <img src={imgUrl} alt="icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} /> : 'No icon'}
                  </td>
                  <td className="align-middle">{skill.name}</td>
                  <td className="align-middle">{skill.proficiency}%</td>
                  <td className="align-middle">
                    <button onClick={() => handleEdit(skill)} className="btn btn-sm btn-warning me-2">Edit</button>
                    <button onClick={() => handleDelete(skill.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
                );
              })}
              {skills.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">No skills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSkills;
