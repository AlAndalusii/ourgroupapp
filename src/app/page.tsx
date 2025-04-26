'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjMGVhNWU5Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTUwIDE2MEMxMTQgMjIwIDE3MiAxNTAgMTUwIDE2MEMxMjggMTcwIDcyIDE3MCBzMCAxNjAiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg=='); // Base64 encoded SVG default avatar

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    setIsLoaded(true);
    
    // Trigger image animation after page load
    setTimeout(() => {
      setIsImageVisible(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  };

  const users = [
    { id: 1, name: 'Zakariya', color: 'primary' },
    { id: 2, name: 'Fatty', color: 'primary' },
    { id: 3, name: 'Abdullahi', color: 'primary' },
  ];

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar with Profile Toggle */}
      <header className="navbar py-4 z-20 relative container mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/dashboard" 
            className="luxury-button poppins-medium"
          >
            Dashboard
          </Link>
          
          {/* Profile Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-300 hover:border-primary-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <Image 
                src={profileImage} 
                alt="Profile" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </button>
            
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={profileImage} 
                        alt="Profile" 
                        width={48} 
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Profile</p>
                      <p className="text-sm text-gray-500">Upload your image</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label 
                      htmlFor="profile-upload" 
                      className="block w-full text-center py-2 px-4 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition cursor-pointer"
                    >
                      Upload Photo
                    </label>
                    <input 
                      id="profile-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfileImageUpload}
                    />
                  </div>
                </div>
                
                <div className="py-1">
                  {users.map(user => (
                    <Link 
                      key={user.id} 
                      href={`/dashboard?userId=${user.id}`}
                      className="flex items-center px-4 py-2 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}'s Dashboard</span>
                    </Link>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Goal Alignment Section - Inspired by first screenshot */}
      <section className="container mx-auto px-4 py-10 mb-10">
        <div className="flex flex-col items-center">
          <div className="breadcrumb mb-2 text-sm text-gray-500">
            <Link href="/">Spiritual Journey</Link> &gt; <span>Personal Growth</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 tracking-tight">
            Elevate your spiritual journey
          </h1>
          
          <p className="text-xl md:text-2xl text-center max-w-3xl mb-6">
            Track your growth, visualize progress, and connect your daily practices to meaningful goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/journey" 
              className="luxury-button bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all"
            >
              Begin your journey
            </Link>
            <Link 
              href="/trips" 
              className="luxury-button border-2 border-gray-300 px-8 py-4 rounded-full hover:border-gray-400 transition-all"
            >
              Group trips
            </Link>
          </div>
        </div>
      </section>

      {/* Alhambra Archway Image - Landscape Rectangle */}
      <section className="container mx-auto px-4 py-6 mb-10">
        <div className="relative">
          <div 
            className={`w-full aspect-[16/9] rounded-t-2xl overflow-hidden relative shadow-2xl transition-all duration-1000 transform ${isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          >
            <Image 
              src="/victoriano-izquierdo-HoevDVvxInw-unsplash.jpg"
              alt="Alhambra Archway View"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="transition-transform duration-5000 ease-in-out hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          
          {/* Sophisticated Tab */}
          <div className="bg-primary-700/90 text-white py-4 px-6 rounded-b-2xl shadow-lg flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="arabic-font text-3xl font-bold mr-4">الإخوة</h3>
              <span className="h-8 w-px bg-white/30 mx-2"></span>
              <p className="text-lg poppins-light">Cultivating the soul's eternal journey</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              Sacred Architecture
            </div>
          </div>
        </div>
      </section>

      {/* Narrations Section - Luxury Styled */}
      <section className="container mx-auto px-4 py-8 mb-10">
        <h2 className="text-4xl font-bold text-center mb-8 tracking-tight">Wisdom for the Journey</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* First Narration */}
          <div className="relative overflow-hidden rounded-xl shadow-xl transform transition-all hover:-translate-y-2 duration-500">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa" 
                alt="Background Image"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/90 to-primary-700/70"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6 text-white min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="mb-4 w-16 h-1 bg-primary-300"></div>
                <p className="text-right text-xl leading-relaxed mb-6 text-primary-50 arabic-font" dir="rtl">
                  وعن معاوية رضي الله عنه قال‏:‏ قال رسول الله صلى الله عليه وسلم ‏:‏ ‏ "‏من يرد الله به خيرًا يفقه في الدين‏"‏ ‏(‏‏(‏متفق عليه‏)‏‏)‏
                </p>
              </div>
              
              <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                <h3 className="text-xl poppins-semibold mb-2 text-white">Understanding of Deen</h3>
                <p className="text-white/90 poppins-regular">
                  "When Allah wishes good for someone, He bestows upon him the understanding of Deen."
                </p>
                <p className="text-primary-200 poppins-light text-sm mt-2">
                  —Mu'awiyah (May Allah be pleased with him), Al-Bukhari and Muslim
                </p>
              </div>
            </div>
          </div>

          {/* Second Narration */}
          <div className="relative overflow-hidden rounded-xl shadow-xl transform transition-all hover:-translate-y-2 duration-500">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1585036156171-384164a8c675" 
                alt="Background Image"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/90 to-primary-700/70"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6 text-white min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="mb-4 w-16 h-1 bg-primary-300"></div>
                <p className="text-right text-xl leading-relaxed mb-6 text-primary-50 arabic-font" dir="rtl">
                  وعن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال‏:‏ ‏ "‏ومن سلك طريقًا يلتمس فيه علما سهل الله له به طريقًا إلى الجنة‏"‏ ‏(‏‏(‏رواه مسلم‏)‏‏)‏‏.‏
                </p>
              </div>
              
              <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                <h3 className="text-xl poppins-semibold mb-2 text-white">The Path to Jannah</h3>
                <p className="text-white/90 poppins-regular">
                  "Allah makes the way to Jannah easy for him who treads the path in search of knowledge."
                </p>
                <p className="text-primary-200 poppins-light text-sm mt-2">
                  —Abu Hurairah (May Allah be pleased with him), Muslim
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-10 mb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary-800 text-center mb-8">Pillars of Growth</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="bg-primary-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-7 w-7 text-primary-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                  />
                </svg>
              </div>
              <h3 className="poppins-semibold text-xl mb-3 text-gray-800">Intention Setting</h3>
              <p className="poppins-regular text-gray-600 text-sm">
                Define meaningful spiritual goals to nurture your soul's journey. Monthly and yearly goal-setting provides direction and purpose.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl text-center flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="bg-primary-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-7 w-7 text-primary-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
              </div>
              <h3 className="poppins-semibold text-xl mb-3 text-gray-800">Reflection & Insight</h3>
              <p className="poppins-regular text-gray-600 text-sm">
                Visualize your spiritual progression through elegant charts and analytics, revealing patterns and illuminating your path of personal development.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xl text-center flex flex-col items-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="bg-primary-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-7 w-7 text-primary-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <h3 className="poppins-semibold text-xl mb-3 text-gray-800">Communal Growth</h3>
              <p className="poppins-regular text-gray-600 text-sm">
                Journey together with companions who inspire and uplift. Share wisdom, celebrate achievements, and foster a supportive spiritual community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modern Professional Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-primary-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col items-center md:items-start">
              <Logo />
              <p className="poppins-regular text-gray-300 mt-4 max-w-xs text-center md:text-left text-sm">
                Nurture your spiritual growth with intention, track your progress with purpose, and elevate your journey alongside a community of seekers.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-3">Pathways</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Personal Dashboard</Link></li>
                <li><Link href="/goals" className="text-gray-300 hover:text-white transition-colors">Goal Sanctuary</Link></li>
                <li><Link href="/reports" className="text-gray-300 hover:text-white transition-colors">Reflection Journal</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Connect With Us</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-4 text-center">
            <p className="poppins-regular text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="arabic-font text-white">الإخوة</span> | Spiritual Growth Journey. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 