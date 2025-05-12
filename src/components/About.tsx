
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">Om Musicalen</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Årets forestilling tager dig med på en magisk rejse gennem drømmenes land</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-bold mb-4 text-musical-orange">Drømmenes Land</h3>
            <p className="text-gray-700 mb-4">
              I "Drømmenes Land" følger vi en gruppe børn, der opdager en hemmelig portal til en magisk verden, hvor drømme bliver til virkelighed.
            </p>
            <p className="text-gray-700 mb-4">
              Men ikke alt er som det ser ud, og børnene må stå sammen for at redde både drømmenes land og deres egen verden fra den onde mareridt-konge.
            </p>
            <p className="text-gray-700 mb-6">
              Forestillingen er skrevet og udviklet i samarbejde med skolens elever og indeholder originale sange, dans og skuespil.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-musical-light border-none">
                <CardContent className="p-4 text-center">
                  <div className="text-musical-pink text-2xl font-bold">12+</div>
                  <div className="text-sm text-gray-600">Originale sange</div>
                </CardContent>
              </Card>
              <Card className="bg-musical-light border-none">
                <CardContent className="p-4 text-center">
                  <div className="text-musical-blue text-2xl font-bold">45</div>
                  <div className="text-sm text-gray-600">Medvirkende</div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <Card className="overflow-hidden border-none shadow-lg rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
              <CardContent className="p-0">
                <img 
                  src="/placeholder.svg" 
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
