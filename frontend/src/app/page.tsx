import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import TrendingSection from "@/components/TrendingSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <HeroSection />
        <CategoryGrid />
        <TrendingSection />
        <StatsSection />
        <Footer />
      </div>
    </>
  );
}
