
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-musical-light to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="mb-8 animate-float">
            <img 
              src="/placeholder.svg" 
              alt="Musical illustration" 
              className="h-32 w-32 md:h-40 md:w-40 object-contain"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="block font-pacifico text-musical-blue">Årets Musical</span>
            <span className="block text-musical-orange mt-2">"Drømmenes Land"</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Oplev magien, musikken og de fantastiske præstationer fra Bagsværd Friskoles elever i dette års skolemusical!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-musical-blue hover:bg-musical-blue/90 text-white font-medium px-8 py-3 rounded-full transition-transform hover:scale-105"
              size="lg"
            >
              Køb billetter
            </Button>
            <Button 
              variant="outline"
              className="border-musical-orange text-musical-orange hover:bg-musical-orange/10 font-medium px-8 py-3 rounded-full"
              size="lg"
            >
              Se tider
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
