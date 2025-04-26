'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

// Gallery data for luxurious destinations
const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Ancient Palace',
    location: 'Hidden Valley',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'A masterpiece of mystical architecture, featuring intricate calligraphy and mesmerizing geometric patterns.'
  },
  {
    id: 2,
    title: 'Court of Whispers',
    location: 'Forgotten Kingdom',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'An iconic courtyard with a magnificent fountain supported by twelve stone lions, each telling a silent story.'
  },
  {
    id: 3,
    title: 'Painted Palace',
    location: 'Golden City',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'A stunning example of ancient craftsmanship with elaborate tilework and ornate painted ceilings.'
  },
  {
    id: 4,
    title: 'Royal Gardens',
    location: 'Lost City',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'A hidden sanctuary displaying the heights of forgotten architecture and exquisite gardens of timeless beauty.'
  },
  {
    id: 5,
    title: 'Azure Labyrinth',
    location: 'Mountain Haven',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'The legendary blue city nestled high in ancient mountains, known for its striking azure-washed buildings.'
  },
  {
    id: 6,
    title: 'Eternal Gardens',
    location: 'Veiled Oasis',
    image: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
    description: 'A timeless sanctuary offering tranquil beauty and architectural elegance far from the beaten path.'
  }
];

export default function GalleryPage() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  useEffect(() => {
    // Animate content in on page load
    setIsLoaded(true);
  }, []);

  const handleImageLoad = (id: number) => {
    if (!loadedImages.includes(id)) {
      setLoadedImages(prev => [...prev, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Dashboard</Link>
            <Link href="/journey" className="text-gray-600 hover:text-primary-600 transition-colors">Begin Journey</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl font-bold mb-6 text-gray-900 tracking-tight">Mystical Destinations</h1>
            <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 mb-4">
              Embark on a transformative journey to the world's most breathtaking architectural marvels.
            </p>
            <p className="text-gray-500 mb-8">
              Our curated expeditions connect you with centuries of forgotten wisdom and transcendent beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Luxury Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_ITEMS.map((item, index) => (
              <div 
                key={item.id} 
                className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Image Container with Frame Effect */}
                  <div className="relative p-3">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg">
                      {!loadedImages.includes(item.id) && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <Image 
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        onLoad={() => handleImageLoad(item.id)}
                        style={{ 
                          objectFit: 'cover', 
                          objectPosition: 'center',
                          transition: 'transform 0.7s ease-in-out',
                          transform: hoveredItem === item.id ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="px-5 py-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <span className="text-sm text-primary-600 font-medium">{item.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Experience These Hidden Wonders</h2>
            <p className="text-lg text-primary-100 mb-8">
              Join our next expedition to these enigmatic destinations. 
              Limited spaces available for an intimate, transformative experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary-900 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                Register Interest
              </button>
              <button className="px-8 py-4 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <div className="mt-6 md:mt-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} <span className="arabic-font text-white">الإخوة</span> | Spiritual Growth Journey
              </p>
            </div>
            <div className="flex space-x-4 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 