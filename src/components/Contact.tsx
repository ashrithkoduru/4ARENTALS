import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600">We'd love to hear from you</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-900 text-white rounded-3xl p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-300" />
                  <span>info@4arentals.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-gray-300" />
                  <span>123 Rental Street, City, State 12345</span>
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

          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
              <textarea 
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none bg-white"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};