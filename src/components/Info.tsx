
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Ticket } from 'lucide-react';
import { getInfoData } from '@/utils/dataUtils';
import type { SiteData } from '@/lib/supabase';

const Info = () => {
  const [infoData, setInfoData] = useState<SiteData['info']>({
    title: "",
    subtitle: "",
    performances: [],
    tickets: [],
    ticketNote: "",
    address: {
      name: "",
      street: "",
      city: ""
    },
    practical: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInfoData();
        setInfoData(data);
      } catch (error) {
        console.error("Failed to fetch info data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section id="info" className="py-16 bg-musical-light">
        <div className="container mx-auto px-4 text-center">
          Loading info section...
        </div>
      </section>
    );
  }

  return (
    <section id="info" className="py-16 bg-musical-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">{infoData.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{infoData.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-musical-orange" />
              <span>Forestillinger</span>
            </h3>
            
            <div className="space-y-3">
              {infoData.performances.map((performance, index) => (
                <Card key={index} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                      <p className="font-medium">{performance.date}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{performance.time}</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-musical-orange hover:bg-musical-orange/90 text-white">
                      Køb billet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-musical-orange" />
                <span>Billetter</span>
              </h3>
              
              <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {infoData.tickets.map((ticket, index) => (
                      <div key={index} className={index === 2 ? "col-span-2" : ""}>
                        <p className="font-medium">{ticket.type}</p>
                        <p className="text-musical-orange font-semibold">{ticket.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>{infoData.ticketNote}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Praktisk information</h3>
            
            <Card className="bg-white border-none shadow-sm mb-6">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Adresse</h4>
                <p className="text-gray-700 mb-4">
                  {infoData.address.name}<br />
                  {infoData.address.street}<br />
                  {infoData.address.city}
                </p>
                
                {infoData.practical.map((item, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-medium mb-2">{item.title}</h4>
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2240.1669357460726!2d12.4525!3d55.7612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDE1JzQyLjAiTiAxMsKwMjcnMTguMiJF!5e0!3m2!1sen!2sdk!4v1624286726275!5m2!1sen!2sdk" 
                width="100%" 
                height="250" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                title="Skolens placering"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
