import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Order by createdAt descending so newest are first
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages: ", error);
      toast.error('Failed to fetch messages');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRead = async (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await updateDoc(doc(db, 'messages', message.id), { read: true });
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', id));
        toast.success('Message deleted successfully!');
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        toast.error('Failed to delete message');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Contact Messages</h2>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-5">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Inbox ({messages.filter(m => !m.read).length} Unread)</h5>
              </div>
              <ul className="list-group list-group-flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {messages.length === 0 && (
                  <li className="list-group-item text-center text-muted py-4">No messages found.</li>
                )}
                {messages.map((msg) => (
                  <li 
                    key={msg.id} 
                    className={`list-group-item list-group-item-action ${selectedMessage?.id === msg.id ? 'active' : ''} ${!msg.read ? 'fw-bold' : ''}`}
                    onClick={() => handleRead(msg)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1 text-truncate" style={{ maxWidth: '70%' }}>{msg.name}</h6>
                      <small>{msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleDateString() : 'Just now'}</small>
                    </div>
                    <p className="mb-1 text-truncate" style={{ fontSize: '0.9rem' }}>{msg.subject}</p>
                    <small className={selectedMessage?.id === msg.id ? "text-light" : "text-muted"}>{msg.email}</small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-md-7">
            {selectedMessage ? (
              <div className="card shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark">{selectedMessage.subject}</h5>
                  <button onClick={() => handleDelete(selectedMessage.id)} className="btn btn-sm btn-outline-danger">Delete</button>
                </div>
                <div className="card-body">
                  <div className="mb-4 border-bottom pb-3">
                    <strong>From:</strong> {selectedMessage.name} &lt;{selectedMessage.email}&gt;<br/>
                    <small className="text-muted">
                      {selectedMessage.createdAt ? new Date(selectedMessage.createdAt.toDate()).toLocaleString() : 'Just now'}
                    </small>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="card-footer bg-white">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="btn btn-primary">
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center bg-light text-muted" style={{ minHeight: '300px' }}>
                <div className="text-center">
                  <i className="bx bx-envelope" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-2">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
