'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import AOS from 'aos';
import { initializeUserDataIfNeeded } from '@/utils/storage';
import { UserData } from '@/types';

// Initialize sample data for 3 users
const initializeAppData = () => {
  const sampleData: Record<number, UserData> = {
    1: {
      userId: 1,
      yearlyGoals: [
        { id: 1, title: 'Quran: Memorised Ten Juzz', description: 'Memorised Ten Juzz', completed: false },
        { id: 2, title: 'Arabic: Complete B1 Level', description: 'Private lessons', completed: false },
      ],
      monthlyGoals: {
        'January': [],
        'February': [
          { id: 1, title: 'Quran: Memorise Last Two Juzz', description: 'Daily practice', completed: false, month: 'February', score: 0 },
          { id: 2, title: 'Arabic: Finish Mustawa 3', description: 'Complete exam', completed: false, month: 'February', score: 0 },
        ],
        'March': [],
        'April': [],
        'May': [],
        'June': [],
        'July': [],
        'August': [],
        'September': [],
        'October': [],
        'November': [],
        'December': [],
      },
      monthlyScores: {
        'January': 0,
        'February': 0,
        'March': 0,
        'April': 0,
        'May': 0,
        'June': 0,
        'July': 0,
        'August': 0,
        'September': 0,
        'October': 0,
        'November': 0,
        'December': 0,
      }
    },
    2: {
      userId: 2,
      yearlyGoals: [
        { id: 1, title: 'Quran: Memorize Juzz 30', description: 'Daily practice', completed: false },
        { id: 2, title: 'Business: Launch new product', description: 'Mande shoes', completed: false },
      ],
      monthlyGoals: {
        'January': [],
        'February': [],
        'March': [],
        'April': [],
        'May': [],
        'June': [],
        'July': [],
        'August': [],
        'September': [],
        'October': [],
        'November': [],
        'December': [],
      },
      monthlyScores: {
        'January': 0,
        'February': 0,
        'March': 0,
        'April': 0,
        'May': 0,
        'June': 0,
        'July': 0,
        'August': 0,
        'September': 0,
        'October': 0,
        'November': 0,
        'December': 0,
      },
      businesses: [
        {
          id: 1,
          name: 'Mande',
          tasks: [
            { id: 1, title: 'Meet with designer', completed: false, isWeekly: true },
            { id: 2, title: 'Organize marketing plan', completed: false, isWeekly: true },
          ],
          monthlyGoals: {
            'February': [
              { id: 1, title: 'Launch new shoe line', description: 'Complete product development', completed: false, month: 'February', score: 0 },
            ],
          }
        }
      ]
    },
    3: {
      userId: 3,
      yearlyGoals: [
        { id: 1, title: 'Quran: Memorize Juzz 28-30', description: 'Daily practice', completed: false },
        { id: 2, title: 'Business: Start AI agency', description: 'Voice AI services', completed: false },
      ],
      monthlyGoals: {
        'January': [],
        'February': [],
        'March': [],
        'April': [],
        'May': [],
        'June': [],
        'July': [],
        'August': [],
        'September': [],
        'October': [],
        'November': [],
        'December': [],
      },
      monthlyScores: {
        'January': 0,
        'February': 0,
        'March': 0,
        'April': 0,
        'May': 0,
        'June': 0,
        'July': 0,
        'August': 0,
        'September': 0,
        'October': 0,
        'November': 0,
        'December': 0,
      }
    }
  };

  // Initialize data for each user if not already present
  for (const userId of [1, 2, 3]) {
    initializeUserDataIfNeeded(userId, sampleData[userId]);
  }
};

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

    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true
    });

    window.addEventListener('scroll', handleScroll);
    setIsLoaded(true);
    
    // Trigger image animation after page load
    setTimeout(() => {
      setIsImageVisible(true);
    }, 500);

    // Initialize app data on first load
    if (typeof window !== 'undefined') {
      console.log('Initializing app data...');
      initializeAppData();
      console.log('App data initialization complete');
    }

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

      {/* Goal Alignment Section - Hero Section */}
      <section className="relative py-20 overflow-hidden mb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="/white-mosque.jpg"
            alt="Sheikh Zayed Grand Mosque"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 via-primary-800/50 to-primary-600/60 mix-blend-multiply"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
            {/* Left Content: Breadcrumb and Text */}
            <div className="flex flex-col" data-aos="fade-right">
              <div className="breadcrumb mb-3 text-sm text-white/70 flex items-center space-x-2">
                <Link href="/" className="hover:text-white transition-colors duration-300">Spiritual Journey</Link> 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white/90">Personal Growth</span>
              </div>
              
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight"
                style={{
                  textShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <span className="inline-block transform transition-all duration-700 hover:translate-y-[-2px] hover:text-primary-300">Elevate</span>
                <span className="inline-block transform transition-all duration-700 hover:translate-y-[-2px] hover:text-primary-300"> your</span>
                <span className="inline-block transform transition-all duration-700 hover:translate-y-[-2px] hover:text-primary-300"> spiritual</span>
                <span className="inline-block transform transition-all duration-700 hover:translate-y-[-2px] hover:text-primary-300"> journey</span>
              </h1>
              
              <p className="text-xl text-white/85 mb-8 leading-relaxed max-w-xl">
                Track your growth, visualize progress, and connect your daily practices to meaningful goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/journey" 
                  className="relative overflow-hidden group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300 hover:bg-primary-600 hover:border-primary-600 hover:scale-105 shadow-lg"
                >
                  <span className="relative z-10 font-medium">Begin your journey</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link 
                  href="/trips" 
                  className="relative overflow-hidden group backdrop-blur-md bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full transition-all duration-300 hover:border-white/90 hover:bg-white/10 hover:scale-105 shadow-lg"
                >
                  <span className="relative z-10 font-medium">Group trips</span>
                </Link>
              </div>
            </div>
            
            {/* Right Content: Decorative Element */}
            <div 
              className="hidden md:flex justify-center items-center"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="relative w-[400px] h-[400px]">
                {/* Islamic Geometric Pattern - Animated */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-white/20 animate-spin" style={{animationDuration: '30s'}}></div>
                  <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-white/15 animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}}></div>
                  <div className="absolute w-[80%] h-[80%] rounded-full border-2 border-white/10 animate-spin" style={{animationDuration: '20s'}}></div>
                  <div className="absolute w-[70%] h-[70%] rounded-full border-2 border-primary-300/30 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                  <div className="absolute w-[60%] h-[60%] rounded-full border-2 border-primary-400/40 animate-spin" style={{animationDuration: '10s'}}></div>
                  
                  {/* Inner Geometric Elements */}
                  <div className="absolute w-48 h-48 flex items-center justify-center">
                    <div className="w-full h-full bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-tr from-primary-500/30 to-primary-300/30 rounded-full blur-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Image with Islamic Text Boxes */}
      <section className="relative py-20 overflow-hidden mb-16">
        <div className="container mx-auto px-6">
          <div 
            className="relative overflow-hidden rounded-xl shadow-xl"
            data-aos="fade-up"
          >
            {/* Decorative Luxury Border */}
            <div className="absolute inset-0 z-0 border-2 border-primary-300/20 rounded-xl"></div>
            <div className="absolute inset-1 z-0 border border-primary-400/10 rounded-xl"></div>
            
            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 min-h-[500px]">
              {/* Left Column - Image */}
              <div className="relative overflow-hidden rounded-tl-xl rounded-bl-xl">
                <div className="relative z-0 h-full">
                  <Image 
                    src="/person-praying.jpg"
                    alt="Person praying in an ornate mosque"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className={`transition-all duration-700 ease-in-out ${isImageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    priority
                  />
                  
                  {/* Gradient Overlay - Matching Style with Hero Section */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 via-primary-800/50 to-primary-600/60 mix-blend-multiply"></div>
                  
                  {/* Pulsating Overlay - Matching Hero Animation Style */}
                  <div className="absolute inset-0 bg-primary-500/5 animate-pulse" style={{animationDuration: '3s'}}></div>
                  <div className="absolute inset-0 bg-primary-600/5 animate-pulse" style={{animationDuration: '5s'}}></div>
                </div>
              </div>
              
              {/* Right Column - Text Boxes */}
              <div className="flex flex-col bg-white rounded-tr-xl rounded-br-xl shadow-lg">
                {/* Box 1 - Top */}
                <div className="flex-1 border-b border-primary-200/30 p-6 md:p-8 animate-pulse" style={{animationDuration: '4s'}}>
                  <div className="flex items-center mb-4">
                    <div className="h-px w-6 bg-gradient-to-r from-transparent to-primary-300"></div>
                    <div className="px-4">
                      <h3 className="arabic-font text-primary-700 text-2xl font-bold" dir="rtl">باب اليقين والتوكل</h3>
                    </div>
                    <div className="h-px flex-grow bg-gradient-to-l from-transparent to-primary-300"></div>
                  </div>
                  <p className="text-right text-lg leading-relaxed text-gray-700 arabic-font" dir="rtl">
                    عن أبي هريرة رضي الله عنه عن النبي صلى الله عليه وسلم قال‏:‏ ‏ "‏يدخل الجنة أقوام أفئدتهم مثل أفئدة الطير‏"
                  </p>
                  <div className="mt-3 flex justify-end">
                    <span className="text-primary-600 text-sm poppins-light">—رواه مسلم</span>
                  </div>
                </div>
                
                {/* Box 2 - Bottom */}
                <div className="flex-1 p-6 md:p-8 animate-pulse" style={{animationDuration: '5s'}}>
                  <div className="flex items-center mb-4">
                    <div className="h-px w-6 bg-gradient-to-r from-transparent to-primary-300"></div>
                    <div className="px-4">
                      <h3 className="arabic-font text-primary-700 text-2xl font-bold" dir="rtl">كتاب الدعوات</h3>
                    </div>
                    <div className="h-px flex-grow bg-gradient-to-l from-transparent to-primary-300"></div>
                  </div>
                  <p className="text-right text-lg leading-relaxed text-gray-700 arabic-font" dir="rtl">
                    قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ إِنَّ حُسْنَ الظَّنِّ بِاللَّهِ مِنْ حُسْنِ عِبَادَةِ اللَّهِ ‏"
                  </p>
                  <div className="mt-3 flex justify-end">
                    <span className="text-primary-600 text-sm poppins-light">—رواه أبو داود</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Caption */}
            <div className="bg-white py-4 px-6 md:px-8 border-t border-primary-200/30 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary-300"></div>
                <div className="px-4">
                  <span className="arabic-font text-primary-600 text-xl">رحلة روحية</span>
                </div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary-300"></div>
              </div>
              <p className="text-center text-gray-600 leading-relaxed max-w-2xl mx-auto">
                In the stillness of prayer and contemplation, we connect with our higher purpose.
                These sacred moments ground us, allowing the soul to reflect and align with divine guidance on our spiritual journey.
              </p>
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