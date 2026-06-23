import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { uploadImage, uploadMultipleImages } from '../../utils/uploadImage';
import { resolveImagePath } from '../../utils/resolveImage';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '.filter-app', link: '', image: '', images: [] });
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // For Graphic Design
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const projectsCollectionRef = collection(db, 'projects');

  useEffect(() => {
    const unsubscribe = onSnapshot(projectsCollectionRef, (querySnapshot) => {
      setProjects(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      toast.error('Failed to fetch projects');
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

  const handleMultipleFilesChange = (e) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      let imagesArray = formData.images || [];

      // If category is Graphic Design and multiple files are selected
      if (formData.category === '.filter-graphic' && imageFiles.length > 0) {
        const newImages = await uploadMultipleImages(imageFiles, 'projects');
        imagesArray = isEditing ? [...imagesArray, ...newImages] : newImages;
        // The first image acts as the cover
        if (imagesArray.length > 0) imageUrl = imagesArray[0]; 
      } 
      // If a single file is selected (for non-Graphic or as cover)
      else if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'projects');
      }

      // We need either a single image or multiple images
      if (!imageUrl && imagesArray.length === 0) {
        toast.error("Please upload an image for the project.");
        setUploading(false);
        return;
      }

      const projectData = {
        title: formData.title,
        category: formData.category,
        link: formData.link,
        image: imageUrl,
        images: imagesArray
      };

      if (isEditing) {
        const projectDoc = doc(db, 'projects', editId);
        await updateDoc(projectDoc, projectData);
        toast.success('Project updated successfully!');
        setIsEditing(false);
        setEditId(null);
      } else {
        await addDoc(projectsCollectionRef, projectData);
        toast.success('Project added successfully!');
      }
      
      // Reset Form
      setFormData({ title: '', category: '.filter-app', link: '', image: '', images: [] });
      setImageFile(null);
      setImageFiles([]);
      // Clear file inputs visually by resetting the form element if needed, but react handles state.
      document.getElementById('projectForm').reset();
      
    } catch (err) {
      console.error(err);
      toast.error('Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setEditId(project.id);
    setFormData({ 
      title: project.title, 
      category: project.category, 
      link: project.link || '', 
      image: project.image || '', 
      images: project.images || [] 
    });
    setImageFile(null);
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const projectDoc = doc(db, 'projects', id);
        await deleteDoc(projectDoc);
        toast.success('Project deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const removeImageFromArray = async (indexToRemove) => {
    const updatedImages = formData.images.filter((_, idx) => idx !== indexToRemove);
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <div>
      <h2 className="mb-4">Manage Projects</h2>
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEditing ? 'Edit Project' : 'Add New Project'}</h4>
        </div>
        <div className="card-body">
          <form id="projectForm" onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Project Title</label>
              <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                <option value=".filter-app">Web-App</option>
                <option value=".filter-mobile">Mobile Application</option>
                <option value=".filter-ux">UX/UI Design</option>
                <option value=".filter-graphic">Graphic Design</option>
                <option value=".filter-other">Other</option>
              </select>
            </div>

            {formData.category === '.filter-graphic' ? (
              <div className="col-md-12 mb-3">
                <label className="form-label">Upload Multiple Images (Graphic Design Gallery)</label>
                <input type="file" className="form-control" accept="image/*" multiple onChange={handleMultipleFilesChange} required={!isEditing && formData.images.length === 0} />
                <small className="text-muted">You can select multiple files at once.</small>
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '80px', height: '80px' }}>
                        <img src={imgUrl} alt={`Uploaded ${idx}`} className="img-thumbnail w-100 h-100" style={{ objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeImageFromArray(idx)} className="btn btn-danger btn-sm position-absolute top-0 end-0 py-0 px-1" style={{ fontSize: '10px' }}>X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="col-md-6 mb-3">
                <label className="form-label">Upload Cover Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} required={!isEditing && !formData.image} />
                {formData.image && <img src={formData.image} alt="Cover" className="img-thumbnail mt-2" style={{ maxHeight: '100px' }} />}
              </div>
            )}
            
            {formData.category !== '.filter-graphic' && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Project Link (Optional)</label>
                <input type="text" className="form-control" name="link" placeholder="e.g. https://github.com/my-project" value={formData.link} onChange={handleChange} />
              </div>
            )}
            
            <div className="col-12 mt-3">
              <button type="submit" className="btn btn-primary me-2" disabled={uploading}>
                {uploading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Uploading...</>
                ) : (
                  isEditing ? 'Update Project' : 'Add Project'
                )}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => { 
                  setIsEditing(false); 
                  setFormData({ title: '', category: '.filter-app', link: '', image: '', images: [] });
                  setImageFile(null);
                  setImageFiles([]);
                  document.getElementById('projectForm').reset();
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
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const imgUrl = resolveImagePath(project.image || (project.images && project.images[0]));
                return (
                <tr key={project.id}>
                  <td className="align-middle">
                    <img src={imgUrl} alt="thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className="align-middle">{project.title}</td>
                  <td className="align-middle">{project.category.replace('.filter-', '')}</td>
                  <td className="align-middle">
                    <button onClick={() => handleEdit(project)} className="btn btn-sm btn-warning me-2">Edit</button>
                    <button onClick={() => handleDelete(project.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
