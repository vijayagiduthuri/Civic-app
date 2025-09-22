import React from 'react';
import { Building2, LogIn } from 'lucide-react';

const LandingPage = () => {
  const scrollingTexts = {
    hindi: "आधिकारिक नागरिक समस्या प्रबंधन पोर्टल में आपका स्वागत है • नगरपालिका समस्याओं की रिपोर्ट करें और ट्रैक करें • मिलकर बेहतर समुदाय बनाएं • शहरी विकास के लिए आपकी आवाज महत्वपूर्ण है • ",
    english: "Welcome to the Official Civic Issues Management Portal • Report and Track Municipal Problems • Build Better Communities Together • Your Voice Matters for Urban Development • ",
    telugu: "అధికారిక పౌర సమస్యల నిర్వహణ పోర్టల్‌కు స్వాగతం • మునిసిపల్ సమస్యలను రిపోర్ట్ చేసి ట్రాక్ చేయండి • కలిసి మెరుగైన కమ్యూనిటీలను నిర్మించండి • పట్టణ అభివృద్ధికి మీ స్వరం ముఖ్యం • "
  };

  const combinedScrollingText = scrollingTexts.hindi + scrollingTexts.english + scrollingTexts.telugu;

  const handleLoginRedirect = () => {
    // Redirect to your login page
    window.location.href = '/login'; // Replace with your actual login page route
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('https://images.squarespace-cdn.com/content/v1/5fd14a8ad4328f0b6168fcaa/e1d0b1b8-fddd-4a6a-81a4-b81778b811c8/Copy+of+20230627_091144.jpg')`
        }}
      />

      {/* Top Banner with Scrolling Text */}
      <div className="relative bg-sky-600 border-b-4 border-sky-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold">Government of India</div>
                <div className="text-xs opacity-90">Digital India Initiative</div>
              </div>
            </div>
            
            {/* Login Button */}
            <button 
              onClick={handleLoginRedirect}
              className="flex items-center space-x-2 bg-white text-sky-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        {/* Scrolling Text Bar */}
        <div className="bg-sky-700 py-2 overflow-hidden">
          <div className="animate-scroll whitespace-nowrap">
            <span className="text-white text-sm font-medium">
              {combinedScrollingText.repeat(5)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center h-full">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Civic Issues
            <span className="block text-sky-500">Management Portal</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Administrative portal for tracking and managing citizen-reported civic issues
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;