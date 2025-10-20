import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Shield, FileText, Clock } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Load Usercentrics script
    const script = document.createElement('script');
    script.id = 'usercentrics-ppg';
    script.setAttribute('privacy-policy-id', '37b3e59a-9d45-4452-a166-465d24908cbf');
    script.src = 'https://policygenerator.usercentrics.eu/api/privacy-policy';
    script.async = true;
    
    document.body.appendChild(script);

    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('usercentrics-ppg');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <FileText className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600 text-sm">
                We're clear about what data we collect and why
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">
                Your data is protected with industry-standard security
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Updated</h3>
              <p className="text-gray-600 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {/* Usercentrics Privacy Policy will be injected here */}
            <div className="uc-privacy-policy prose prose-gray max-w-none">
              {/* The Usercentrics script will populate this div */}
            </div>

            {/* Fallback loading message */}
            <div id="privacy-loading" className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading privacy policy...</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="text-gray-700 mb-6">
              If you have any questions or concerns about our privacy practices, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:privacy@4arentals.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                Email Privacy Team
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-medium border-2 border-gray-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};