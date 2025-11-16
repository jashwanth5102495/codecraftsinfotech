import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const [currentCard, setCurrentCard] = useState(2); // Start with center card
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const destinations = [
    {
      id: 1,
      name: "On Time Delivery",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center",
      description: "Guaranteed project delivery with strict adherence to deadlines"
    },
    {
      id: 2,
      name: "AI Integration",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center",
      description: "Seamlessly integrate cutting-edge AI solutions into your systems"
    },
    {
      id: 3,
      name: "AI Automation",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop&crop=center",
      description: "Transform workflows with intelligent automation powered by AI"
    },
    {
      id: 4,
      name: "Web Applications",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
      description: "Custom web applications built with modern technologies"
    },
    {
      id: 5,
      name: "Mobile Applications",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
      description: "Native and cross-platform mobile apps for iOS and Android"
    }
  ];

  const nextCard = () => {
    setCurrentCard(prev => prev === destinations.length - 1 ? 0 : prev + 1);
  };

  const prevCard = () => {
    setCurrentCard(prev => prev === 0 ? destinations.length - 1 : prev - 1);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextCard();
      }, 7000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-400 text-sm">• Client Experiences</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Explore Our Services
          </h1>
        </div>

        {/* Horizontal Carousel Section */}
        <div 
          className="relative mb-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Container */}
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-8 max-w-6xl overflow-hidden">
              {destinations.map((destination, index) => {
                const distance = Math.abs(index - currentCard);
                const isActive = index === currentCard;
                const isVisible = distance <= 2;
                
                if (!isVisible) return null;

                return (
                  <div
                    key={destination.id}
                    className={`transition-all duration-500 ease-out ${
                      isActive 
                        ? 'scale-100 opacity-100 z-20' 
                        : distance === 1 
                          ? 'scale-75 opacity-70 z-10' 
                          : 'scale-50 opacity-40 z-0'
                    }`}
                    style={{
                      transform: isActive 
                        ? 'translateX(0)' 
                        : index < currentCard 
                          ? 'translateX(-20%)' 
                          : 'translateX(20%)'
                    }}
                  >
                    <div className="relative">
                      <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                        <img 
                          src={destination.image} 
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <h3 className="text-white text-xl font-bold">{destination.name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={prevCard}
              className="bg-white text-black px-8 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Prev</span>
            </button>
            <div className="mx-4"></div>
            <button 
              onClick={nextCard}
              className="bg-white text-black px-8 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description and CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Explore the enchanting stories of innovators who have collected unforgettable memories and delightful experiences with our cutting-edge technology solutions.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Get Started
          </button>
        </div>

        {/* Company Description */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-12 border border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">About CodeCrafts Infotech</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                At <strong className="text-white">CodeCrafts Infotech</strong>, we are focused on productivity and creating smooth workflows that drive business success. We are a full-service software company specializing in building modern, scalable, and user-friendly solutions that help businesses optimize their operations and achieve seamless digital transformation.
              </p>
              <p>
                From end-to-end project management to delivering web applications, mobile applications, and e-commerce platforms, our team ensures every project enhances productivity and creates smooth workflows. With expertise in AI integration and automation, we streamline your business processes and eliminate bottlenecks to maximize efficiency.
              </p>
              <p>
                Beyond client success, we are equally committed to shaping the next generation of innovators. Through our training programs and internship opportunities, we provide students with hands-on experience in trending technologies, preparing them for real-world challenges.
              </p>
              <p>
                Our promise is simple—modern solutions, reliable delivery, and 24/7 support. Whether you are a startup looking to launch or an enterprise seeking to scale, we're here to make technology your greatest advantage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;