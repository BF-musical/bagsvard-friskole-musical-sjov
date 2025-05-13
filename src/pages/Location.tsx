
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getInfoData } from '@/utils/dataUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Location = () => {
  const { toast } = useToast();
  const [locationData, setLocationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getInfoData();
        setLocationData(data.address);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching location data:', error);
        toast({
          title: "Fejl ved indlæsning",
          description: "Kunne ikke indlæse lokationsdata",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Indlæser...</div>;
  }

  if (!locationData) {
    return <div className="min-h-screen flex items-center justify-center">Ingen lokationsdata fundet</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center musical-header">Skolens Placering</h1>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">{locationData.name}</h2>
              <p className="text-gray-700 mb-2">{locationData.street}</p>
              <p className="text-gray-700">{locationData.city}</p>
            </CardContent>
          </Card>
          
          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2240.1669357460726!2d12.4525!3d55.7612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDE1JzQyLjAiTiAxMsKwMjcnMTguMiJF!5e0!3m2!1sen!2sdk!4v1624286726275!5m2!1sen!2sdk" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
              title="Skolens placering"
              className="w-full h-full"
            />
          </div>

          <div className="mt-8 bg-musical-light p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-3">Find vej</h3>
            <p className="mb-4">
              Du kan nemt finde vej til {locationData.name} ved hjælp af offentlig transport eller bil.
              Se kortet ovenfor for præcis placering.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Location;
