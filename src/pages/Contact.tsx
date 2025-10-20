import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-gray-900 text-xl font-light">4A Rentals</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Home</Link>
              <Link to="/fleet" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Fleet</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">About</Link>
              <Link to="/contact" className="text-gray-900 font-medium text-sm">Contact</Link>
              <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about our vehicles or need help with your rental? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-gray-900 text-white rounded-3xl p-8 mb-8">
                <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Phone</p>
                      <p className="text-white font-medium">+1 (469) 403-7094</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Email</p>
                      <p className="text-white font-medium">info@4arentals.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Address</p>
                      <p className="text-white font-medium">123 Rental Street<br />Denton, Texas 76201</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Business Hours</p>
                      <p className="text-white font-medium">Mon - Fri: 8AM - 8PM<br />Sat - Sun: 9AM - 6PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map Placeholder */}
              <div className="bg-gray-100 rounded-3xl h-64 relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Our Location</h4>
                  <p className="text-gray-600 mb-1">123 Rental Street</p>
                  <p className="text-gray-600 mb-1">Denton, Texas 76201</p>
                  <p className="text-gray-600">United States</p>
                  <button 
                    onClick={() => window.open('https://maps.google.com/?q=Denton,Texas', '_blank')}
                    className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    View on Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
                  <textarea 
                    rows={6}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none bg-white"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What do I need to rent a car?</h3>
              <p className="text-gray-600">You'll need a valid driver's license, credit card, and to be at least 21 years old. International visitors need a valid passport and international driving permit.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I modify or cancel my reservation?</h3>
              <p className="text-gray-600">Yes! You can modify or cancel your reservation up to 24 hours before your pickup time without any fees. Changes within 24 hours may incur a small fee.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is insurance included?</h3>
              <p className="text-gray-600">All our rentals include basic insurance coverage. We also offer additional coverage options for extra peace of mind at competitive rates.</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer student discounts?</h3>
              <p className="text-gray-600">Yes! We offer special rates for students with valid student ID. Contact us for more information about our student discount program.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">4A Rentals</h3>
            <p className="text-gray-400 mb-4">Premium car rental service</p>
            <p className="text-gray-500 text-sm">&copy; 2025 4A Rentals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};