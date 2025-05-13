
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAboutData } from "@/utils/dataUtils";
import type { SiteData } from '@/lib/supabase';

const About = () => {
  const [aboutData, setAboutData] = useState<SiteData['about']>({
    title: "",
    subtitle: "",
    heading: "",
    paragraphs: [],
    stats: [],
    image: ""
  });
  
  useEffect(() => {
    setAboutData(getAboutData());
  }, []);
  
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">{aboutData.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{aboutData.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4 text-musical-orange">{aboutData.heading}</h3>
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4">{paragraph}</p>
            ))}
            
            <div className="grid grid-cols-2 gap-4">
              {aboutData.stats.map((stat, index) => (
                <Card key={index} className="bg-musical-light border-none">
                  <CardContent className="p-4 text-center">
                    <div className={`text-${index === 0 ? 'musical-pink' : 'musical-blue'} text-2xl font-bold`}>{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <Card className="overflow-hidden border-none shadow-lg rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
              <CardContent className="p-0">
                <img 
                  src={aboutData.image} 
                  alt="Musical rehearsal" 
                  className="w-full h-[300px] object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
