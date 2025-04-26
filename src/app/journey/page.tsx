'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Logo from '@/components/Logo';

// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

export default function JourneyPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Data for spiritual growth chart
  const lineChartData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Spiritual Growth',
        data: [0, 0, 0, 0, 0, 0],
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        tension: 0.4,
      }
    ],
  };

  // Data for habits balance chart
  const doughnutData = {
    labels: ['Practice 1', 'Practice 2', 'Practice 3', 'Practice 4', 'Practice 5'],
    datasets: [
      {
        data: [20, 20, 20, 20, 20],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 1,
      }
    ],
  };

  // Data for personal assessment chart
  const radarData = {
    labels: ['Dimension 1', 'Dimension 2', 'Dimension 3', 'Dimension 4', 'Dimension 5'],
    datasets: [
      {
        label: 'Current State',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 0.8)',
        borderWidth: 2,
      },
      {
        label: 'Goal State',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 2,
      }
    ],
  };

  // Chart options for better styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      }
    }
  };

  // Specific options for radar chart
  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        pointLabels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        },
        ticks: {
          display: false,
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">Dashboard</Link>
            <Link href="/trips" className="text-gray-600 hover:text-primary-600 transition-colors">Group Trips</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1506059612708-99d6c258160e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Spiritual Journey"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Begin Your Spiritual Journey</h1>
            <p className="text-xl mb-8 text-gray-100">
              Every meaningful journey begins with a single step. Track your progress, set meaningful goals, and visualize your growth on the path of spiritual development.
            </p>
            <Link 
              href="/dashboard" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg inline-block shadow-lg transition-colors"
            >
              Access Your Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Growth Analytics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Growth Analytics</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visualize your spiritual progress through sophisticated analytics. Identify patterns, recognize growth areas, and celebrate your achievements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Spiritual Growth Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Spiritual Growth Trajectory</h3>
              <div className="h-64">
                {isClient && <Line data={lineChartData} options={chartOptions} />}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Visualize your consistent upward trajectory in spiritual growth over time.
              </p>
            </div>

            {/* Habits Balance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Balanced Practices</h3>
              <div className="h-64">
                {isClient && <Doughnut data={doughnutData} options={chartOptions} />}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                A well-rounded spiritual journey encompasses multiple dimensions of growth.
              </p>
            </div>

            {/* Personal Assessment Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Current vs. Aspiration</h3>
              <div className="h-64">
                {isClient && <Radar data={radarData} options={radarOptions} />}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Map your current state against your aspirations across key spiritual dimensions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Steps Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Path Forward</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your spiritual journey unfolds in deliberate stages. Each step builds upon the previous, creating a foundation for profound growth.
            </p>
          </div>

          <div className="relative">
            {/* Journey Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-16 relative z-10">
              {/* Step 1 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                  <h3 className="text-2xl font-bold text-primary-600 mb-3">Self-Assessment</h3>
                  <p className="text-gray-600">
                    Begin with honest reflection on your current spiritual state. Identify strengths, weaknesses, and areas for focused development.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-start">
                  <div className="bg-primary-100 rounded-lg p-3 inline-block">
                    <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">1</div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 flex justify-end md:order-last">
                  <div className="bg-primary-100 rounded-lg p-3 inline-block">
                    <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">2</div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:order-first">
                  <h3 className="text-2xl font-bold text-primary-600 mb-3">Goal Setting</h3>
                  <p className="text-gray-600">
                    Establish meaningful monthly and yearly goals that are specific, measurable, and aligned with your spiritual aspirations.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                  <h3 className="text-2xl font-bold text-primary-600 mb-3">Daily Practices</h3>
                  <p className="text-gray-600">
                    Implement consistent daily habits that nurture your spiritual growth. Small, regular actions create profound transformation over time.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-start">
                  <div className="bg-primary-100 rounded-lg p-3 inline-block">
                    <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">3</div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 flex justify-end md:order-last">
                  <div className="bg-primary-100 rounded-lg p-3 inline-block">
                    <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">4</div>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 md:order-first">
                  <h3 className="text-2xl font-bold text-primary-600 mb-3">Reflection & Adjustment</h3>
                  <p className="text-gray-600">
                    Regularly review your progress, celebrate victories, and adjust your approach based on insights gained along the path.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="md:flex items-center">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-12 md:text-right">
                  <h3 className="text-2xl font-bold text-primary-600 mb-3">Community Engagement</h3>
                  <p className="text-gray-600">
                    Share your journey with trusted companions. Collective wisdom, mutual support, and shared experiences enrich your spiritual path.
                  </p>
                </div>
                <div className="md:w-1/2 md:pl-12 flex justify-start">
                  <div className="bg-primary-100 rounded-lg p-3 inline-block">
                    <div className="bg-primary-500 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="mb-8 max-w-lg mx-auto">
            Access your personalized dashboard and start tracking your spiritual progress today.
          </p>
          <Link 
            href="/dashboard" 
            className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 rounded-lg inline-block shadow-lg transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo />
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="arabic-font">الإخوة</span> | Spiritual Growth Journey
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 