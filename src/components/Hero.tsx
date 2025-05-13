
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getHeroData } from "@/utils/dataUtils";
import type { SiteData } from '@/lib/supabase';

const Hero = () => {
  const [heroData, setHeroData] = useState<SiteData['hero']>({
    title: "",
    subtitle: "",
    description: "",
    buttons: {
      primary: "",
      secondary: ""
    },
    image: ""
  });
  
  useEffect(() => {
    setHeroData(getHeroData());
  }, []);
  
  return (
    <div className="relative bg-gradient-to-b from-musical-light to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-8 animate-float">
            <img 
              src={heroData.image} 
              alt="Musical illustration" 
              className="h-32 w-32 md:h-40 md:w-40 object-contain"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="block font-pacifico text-musical-blue">{heroData.title}</span>
            <span className="block text-musical-orange mt-2">{heroData.subtitle}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            {heroData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-musical-blue hover:bg-musical-blue/90 text-white font-medium px-8 py-3 rounded-full transition-transform hover:scale-105"
              size="lg"
            >
              {heroData.buttons.primary}
            </Button>
            <Button 
              variant="outline"
              className="border-musical-orange text-musical-orange hover:bg-musical-orange/10 font-medium px-8 py-3 rounded-full"
              size="lg"
            >
              {heroData.buttons.secondary}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg width="100%" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C166.667 -8 333.333 -8 500 24C666.667 56 833.333 56 1000 24C1166.67 -8 1333.33 -8 1500 24C1666.67 56 1833.33 56 2000 24V48H0V24Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
