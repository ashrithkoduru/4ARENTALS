import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { VehicleGrid } from '../components/VehicleGrid';
import { Offers } from '../components/Offers';
import { Testimonials } from '../components/Testimonials';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { UserProfileModal } from '../components/UserProfileModal';

const Home: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onAuthModalOpen={handleOpenAuthModal}
        onProfileModalOpen={handleOpenProfileModal}
      />
      <Hero />
      <VehicleGrid onAuthModalOpen={handleOpenAuthModal} />
      <Offers />
      <Testimonials />
      <Contact />
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
      />
      
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};

export default Home;