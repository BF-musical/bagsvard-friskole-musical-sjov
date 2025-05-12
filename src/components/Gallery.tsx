
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const images = [
  { src: "/placeholder.svg", alt: "Forestillingsbillede 1" },
  { src: "/placeholder.svg", alt: "Forestillingsbillede 2" },
  { src: "/placeholder.svg", alt: "Forestillingsbillede 3" },
  { src: "/placeholder.svg", alt: "Forestillingsbillede 4" },
  { src: "/placeholder.svg", alt: "Forestillingsbillede 5" },
  { src: "/placeholder.svg", alt: "Forestillingsbillede 6" },
];

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-16 bg-musical-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">Galleri</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Glimt fra prøver og tidligere forestillinger</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0 cursor-pointer" onClick={() => openLightbox(index)}>
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-[200px] object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-1 bg-black/90">
          <div className="relative">
            <DialogClose className="absolute top-2 right-2 z-10">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
            
            <div className="flex justify-center items-center h-full relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute left-0 text-white hover:bg-white/20 z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <img 
                src={images[selectedImageIndex].src} 
                alt={images[selectedImageIndex].alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 text-white hover:bg-white/20 z-10"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;
