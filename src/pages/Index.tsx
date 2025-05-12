
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Cast from "@/components/Cast";
import Info from "@/components/Info";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Cast />
      <Info />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
