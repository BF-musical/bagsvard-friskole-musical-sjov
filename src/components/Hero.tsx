
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getHeroData } from '@/utils/dataUtils';
import type { SiteData } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroData, setHeroData] = useState<SiteData['hero']>({
    title: "",
    subtitle: "",
    description: "",
    buttons: {},
    image: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHeroData();
        setHeroData(data);
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-musical-light">
        <div className="container mx-auto px-4 text-center">
          Loading hero section...
        </div>
      </section>
    );
  }

  const scrollToInfo = () => {
    const infoSection = document.getElementById('info');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-musical-light">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 musical-header">
              {heroData.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-musical-orange mb-6">
              {heroData.subtitle}
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto md:mx-0">
              {heroData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {heroData.buttons?.primary && (
                <Link to="/location">
                  <Button className="bg-musical-orange hover:bg-musical-orange/90 text-white">
                    {heroData.buttons.primary}
                  </Button>
                </Link>
              )}
              {heroData.buttons?.secondary && (
                <Button 
                  variant="outline" 
                  className="border-musical-blue text-musical-blue hover:bg-musical-blue/10"
                  onClick={scrollToInfo}
                >
                  {heroData.buttons.secondary}
                </Button>
              )}
            </div>
          </div>
          <div className="mt-8 md:mt-0 flex justify-center md:justify-end">
            <img 
              src={heroData.image} 
              alt="Musical Promotion" 
              className="rounded-lg shadow-xl max-w-full h-auto animate-float" 
              style={{ maxHeight: '500px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
