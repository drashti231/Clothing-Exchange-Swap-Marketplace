import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-dark mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about swapping, 
          feedback on the platform, or just want to say hi.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-warm-cream p-6 rounded-xl flex items-start space-x-4">
            <Mail className="w-6 h-6 text-danger-tag flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-text-main mb-1">Email Us</h3>
              <p className="text-gray-600 text-sm">Our friendly team is here to help.</p>
              <a href="mailto:hello@rewear.com" className="text-brand-primary font-medium hover:underline mt-2 inline-block">hello@rewear.com</a>
            </div>
          </div>
          
          <div className="bg-warm-cream p-6 rounded-xl flex items-start space-x-4">
            <MessageSquare className="w-6 h-6 text-danger-tag flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-text-main mb-1">Live Chat</h3>
              <p className="text-gray-600 text-sm">Available Mon-Fri, 9am to 5pm EST.</p>
              <button className="text-brand-primary font-medium hover:underline mt-2 inline-block">Start a chat</button>
            </div>
          </div>

          <div className="bg-warm-cream p-6 rounded-xl flex items-start space-x-4">
            <MapPin className="w-6 h-6 text-danger-tag flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-text-main mb-1">Office</h3>
              <p className="text-gray-600 text-sm">Come say hello at our HQ.</p>
              <p className="text-gray-700 text-sm mt-2 font-medium">123 Eco Way<br/>Sustainable City, SC 12345</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-text-main mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                type="text" 
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
                placeholder="How can we help you?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition resize-none"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-brand-dark text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition shadow-sm disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
