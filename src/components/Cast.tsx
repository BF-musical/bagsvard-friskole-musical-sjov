
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCastData } from '@/utils/dataUtils';
import type { SiteData } from '@/lib/supabase';

const Cast = () => {
  const [castData, setCastData] = useState<SiteData['cast']>({
    title: "",
    subtitle: "",
    groups: {}
  });
  const [activeTab, setActiveTab] = useState('skuespillere');
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCastData();
        setCastData(data);
      } catch (error) {
        console.error("Failed to fetch cast data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <section id="cast" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          Loading cast section...
        </div>
      </section>
    );
  }
  
  if (!castData.groups) return null;
  
  const castGroups = castData.groups;
  
  const visibleCastMembers = showMore 
    ? castGroups[activeTab as keyof typeof castGroups] || [] 
    : (castGroups[activeTab as keyof typeof castGroups] || []).slice(0, 4);

  return (
    <section id="cast" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">{castData.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{castData.subtitle}</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="skuespillere" onValueChange={(value) => {
            setActiveTab(value);
            setShowMore(false);
          }}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="skuespillere">Skuespillere</TabsTrigger>
              <TabsTrigger value="dansere">Dansere</TabsTrigger>
              <TabsTrigger value="musikere">Musikere</TabsTrigger>
              <TabsTrigger value="crew">Holdet bag</TabsTrigger>
            </TabsList>
            
            {Object.keys(castGroups).map((group) => (
              <TabsContent key={group} value={group} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  {visibleCastMembers.map((castMember, index) => (
                    <Card key={index} className="border border-gray-200 hover:border-musical-blue transition-colors">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-musical-light flex items-center justify-center text-musical-blue text-xl font-bold">
                          {castMember.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{castMember.name}</h3>
                          <p className="text-musical-orange">{castMember.role}</p>
                          <p className="text-sm text-gray-500">{castMember.grade}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {castGroups[group as keyof typeof castGroups]?.length > 4 && (
                  <div className="text-center mt-6">
                    <Button 
                      variant="ghost" 
                      className="text-musical-blue hover:text-musical-blue/80"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? 'Vis færre' : 'Vis flere'}
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Cast;
