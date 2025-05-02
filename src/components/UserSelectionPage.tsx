'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import the logo components
const AbdullahiLogo = dynamic(() => import('@/components/AbdullahiLogo'), { ssr: false });
const ZakariyaLogo = dynamic(() => import('@/components/ZakariyaLogo'), { ssr: false });

// Define users for the selection page
const USERS = [
  { 
    id: 1, 
    name: 'Zakariya', 
    image: '/logos/zakariya-logo.svg',
    description: 'Track your personal and business goals in one place'
  },
  { 
    id: 2, 
    name: 'Fatty', 
    image: '/IMG_3132.png',
    description: 'Monitor your progress and stay on track with your goals'
  },
  { 
    id: 3, 
    name: 'Abdullahi', 
    image: '/logos/abdullahi-logo.svg',
    description: 'Organize and track your yearly and monthly goals'
  },
];

// Hadith data
const HADITHS = [
  {
    id: 1,
    english: "It was narrated from Jabir that the Messenger of Allah said: \"Ask Allah for beneficial knowledge and seek refuge with Allah from knowledge that is of no benefit.\"",
    arabic: "حَدَّثَنَا عَلِيُّ بْنُ مُحَمَّدٍ، حَدَّثَنَا وَكِيعٌ، عَنْ أُسَامَةَ بْنِ زَيْدٍ، عَنْ مُحَمَّدِ بْنِ الْمُنْكَدِرِ، عَنْ جَابِرٍ، قَالَ قَالَ رَسُولُ اللَّهِ ـ صلى الله عليه وسلم ـ ‏\"‏ سَلُوا اللَّهَ عِلْمًا نَافِعًا وَتَعَوَّذُوا بِاللَّهِ مِنْ عِلْمٍ لاَ يَنْفَعُ ‏\"",
    narrator: "Jabir",
  },
  {
    id: 2,
    english: "Narrated Abu Huraira: Allah's Messenger (ﷺ) said, \"Allah says, 'I have nothing to give but Paradise as a reward to my believer slave, who, if I cause his dear friend (or relative) to die, remains patient (and hopes for Allah's Reward).\"",
    arabic: "حَدَّثَنَا قُتَيْبَةُ، حَدَّثَنَا يَعْقُوبُ بْنُ عَبْدِ الرَّحْمَنِ، عَنْ عَمْرٍو، عَنْ سَعِيدٍ الْمَقْبُرِيِّ، عَنْ أَبِي هُرَيْرَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏\"‏ يَقُولُ اللَّهُ تَعَالَى مَا لِعَبْدِي الْمُؤْمِنِ عِنْدِي جَزَاءٌ، إِذَا قَبَضْتُ صَفِيَّهُ مِنْ أَهْلِ الدُّنْيَا، ثُمَّ احْتَسَبَهُ إِلاَّ الْجَنَّةُ ‏\"‏‏.‏",
    narrator: "Abu Huraira",
  }
];

export default function UserSelectionPage() {
  const router = useRouter();
  const [selectedHadith, setSelectedHadith] = useState(0);

  // Auto rotate hadiths
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedHadith(prev => (prev + 1) % HADITHS.length);
    }, 10000); // Rotate every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleUserSelect = (userId: number) => {
    router.push(`/dashboard?userId=${userId}`);
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Hadith animation variants
  const hadithVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Render appropriate logo based on user ID
  const renderUserLogo = (userId: number, name: string) => {
    switch (userId) {
      case 1:
        return (
          <div className="w-32 h-32 relative mb-6">
            <ZakariyaLogo width={128} height={128} />
          </div>
        );
      case 2:
        return (
          <div className="w-32 h-32 relative mb-6 rounded-full overflow-hidden border-4 border-primary-100">
            <Image
              src="/IMG_3132.png"
              alt={`${name}'s profile`}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        );
      case 3:
        return (
          <div className="w-32 h-32 relative mb-6">
            <AbdullahiLogo width={128} height={128} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Your Dashboard</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Track your goals, visualize progress, and stay motivated on your journey of self-improvement.
        </p>
      </div>

      {/* User Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {USERS.map((user) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
              transition: { type: "spring", stiffness: 400 }
            }}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
            onClick={() => handleUserSelect(user.id)}
          >
            <div className="p-8 flex flex-col items-center">
              {renderUserLogo(user.id, user.name)}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <p className="text-gray-600 text-center">{user.description}</p>
              <button
                className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-300 shadow-md"
              >
                View Dashboard
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Hadith Section */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-primary-800 mb-8 text-center">Inspirational Hadith</h2>
        
        <div className="relative h-80 overflow-hidden">
          {HADITHS.map((hadith, index) => (
            <motion.div
              key={hadith.id}
              className="absolute inset-0 bg-white rounded-xl shadow-md p-6 flex flex-col"
              initial="hidden"
              animate={index === selectedHadith ? "visible" : "hidden"}
              exit="exit"
              variants={hadithVariants}
              style={{ display: index === selectedHadith ? 'flex' : 'none' }}
            >
              <div className="flex-1">
                <p className="text-gray-700 mb-6 text-lg">{hadith.english}</p>
                <p className="text-gray-800 text-right font-arabic text-xl mb-6 leading-loose">{hadith.arabic}</p>
                <p className="text-primary-600 font-medium">— Narrated by {hadith.narrator}</p>
              </div>
              
              <div className="flex justify-center mt-4">
                {HADITHS.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full mx-1 ${
                      idx === selectedHadith ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setSelectedHadith(idx)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 