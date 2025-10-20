import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useOffers } from '../hooks/useOffers';
import Loader from './Loader';

export const Offers: React.FC = () => {
  const { offers, loading, error } = useOffers(true); // Only get active offers

  // Function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Star; // Fallback to Star icon
  };

  if (loading) {
    return (
      <section id="offers" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Loader />
            </div>
            <p className="mt-4 text-gray-600">Loading offers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="offers" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading offers: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section id="offers" className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600">Limited time deals you can't miss</p>
        </div>

        <div className={`grid gap-8 ${
          offers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
          offers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
          'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {offers.map((offer) => {
            const IconComponent = getIconComponent(offer.icon);
            return (
              <div key={offer.id} className="bg-gray-50 text-gray-900 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className={`${offer.iconColor.replace('text-', 'bg-').replace('-600', '-50')} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`w-8 h-8 ${offer.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                  <p className={`text-3xl font-bold mb-2 ${offer.iconColor}`}>{offer.discount}</p>
                  <p className="text-gray-600 mb-6">{offer.description}</p>
                  <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                    {offer.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};