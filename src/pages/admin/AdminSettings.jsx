import React, { useState } from 'react';
import { getAuth, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';
import app from '../../firebase/config';

const AdminSettings = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error('Please enter your current password to make changes.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setUpdating(true);

    try {
      // Re-authenticate user before sensitive operations
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      let updated = false;

      // Update Email if provided
      if (newEmail && newEmail !== user.email) {
        await updateEmail(user, newEmail);
        updated = true;
      }

      // Update Password if provided
      if (newPassword) {
        await updatePassword(user, newPassword);
        updated = true;
      }

      if (updated) {
        toast.success('Account settings updated successfully!');
        setNewEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      } else {
        toast.info('No changes were made.');
      }

    } catch (error) {
      console.error("Update error:", error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect current password.');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use by another account.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('The new password is too weak. Please use a stronger password.');
      } else {
        toast.error('Failed to update settings: ' + error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Account Settings</h2>
      
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Security & Credentials</h5>
        </div>
        <div className="card-body">
          <p className="text-muted mb-4">
            Update your admin dashboard login credentials here. You must provide your current password to save any changes.
          </p>
          <form onSubmit={handleUpdate}>
            
            <div className="mb-4 bg-light p-3 rounded">
              <label className="form-label fw-bold">Current Email</label>
              <input type="text" className="form-control" value={user?.email || ''} disabled />
            </div>

            <h6 className="border-bottom pb-2 mb-3">Change Credentials (Optional)</h6>

            <div className="mb-3">
              <label className="form-label">New Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="Leave blank to keep current" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Leave blank to keep current" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>

            {newPassword && (
              <div className="mb-4">
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Confirm new password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            )}

            <h6 className="border-bottom pb-2 mb-3 text-danger">Verification Required</h6>

            <div className="mb-4">
              <label className="form-label">Current Password <span className="text-danger">*</span></label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter current password to save changes" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={updating}>
              {updating ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...</>
              ) : (
                'Save Changes'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
