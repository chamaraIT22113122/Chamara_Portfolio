import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Firebase Firestore
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });

      // 2. Send Email via Web3Forms
      const formPayload = new FormData();
      formPayload.append("access_key", "89cfb47b-2d00-4d89-8e8b-517bce9ba36b");
      Object.keys(formData).forEach(key => {
        formPayload.append(key, formData[key]);
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert("There was an error sending the email notification, but your message was saved.");
      }
    } catch (err) {
      console.error("Error saving message:", err);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contact</h2>
        </div>

        <div className="row mt-2">
          {/* Address Section */}
          <div className="col-md-6 d-flex align-items-stretch">
            <div className="info-box">
              <i className="bx bx-map"></i>
              <h3>My Address</h3>
              <p>Pinlida Rd, Pattiyawaththa Rd, Kaduwela</p>
            </div>
          </div>

          {/* Social Profiles Section */}
          <div className="col-md-6 mt-4 mt-md-0 d-flex align-items-stretch">
            <div className="info-box">
              <i className="bx bx-share-alt"></i>
              <h3>Social Profiles</h3>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/chamara-nuwan-032a35323" target="_blank" rel="noopener noreferrer" className="linkedin"><i className="bx bxl-linkedin"></i></a>
                <a href="https://github.com/chamaraIT22113122" target="_blank" rel="noopener noreferrer" className="github"><i className="bx bxl-github"></i></a>
                <a href="mailto:cn1120693@gmail.com" target="_blank" rel="noopener noreferrer" className="google"><i className="bx bxl-google"></i></a>
                <a href="https://www.instagram.com/Cha__m_a" target="_blank" rel="noopener noreferrer" className="instagram"><i className="bx bxl-instagram"></i></a>
                <a href="https://www.facebook.com/chamara.nuwan.332345" target="_blank" rel="noopener noreferrer" className="facebook"><i className="bx bxl-facebook"></i></a>
                <a href="https://wa.me/+94702481691" target="_blank" rel="noopener noreferrer" className="whatsapp"><i className="bx bxl-whatsapp"></i></a>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="col-md-6 mt-4 d-flex align-items-stretch">
            <div className="info-box">
              <i className="bx bx-envelope"></i>
              <h3>Email</h3>
              <p><a href="mailto:cn1120693@gmail.com">cn1120693@gmail.com</a></p>
              <p><a href="mailto:tcnbandara@gmail.com">tcnbandara@gmail.com</a></p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-md-6 mt-4 d-flex align-items-stretch">
            <div className="info-box">
              <i className="bx bx-phone-call"></i>
              <h3>Contact</h3>
              <p><a href="tel:+94702481691">+94 70 248 1691</a></p>
              <p><a href="tel:+94775608073">+94 77 560 8073</a></p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="col-12 mt-5">
            {success && (
              <div className="alert alert-success">
                <strong>Success!</strong> Your message has been sent. I will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="php-email-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" name="name" id="name" className="form-control" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="email">Your Email</label>
                  <input type="email" name="email" id="email" className="form-control" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="subject">Subject</label>
                <input type="text" name="subject" id="subject" className="form-control" placeholder="Enter the subject" required value={formData.subject} onChange={handleChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" className="form-control" rows="6" placeholder="Type your message here" required value={formData.message} onChange={handleChange}></textarea>
              </div>
              <div className="text-center mt-4">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? "Submitting..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
