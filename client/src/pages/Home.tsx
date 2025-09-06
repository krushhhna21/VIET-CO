import HeroSection from "@/components/sections/HeroSection";
import DepartmentIntro from "@/components/sections/DepartmentIntro";
import QuickLinks from "@/components/sections/QuickLinks";
import AboutUs from "@/components/sections/AboutUs";
import LatestNews from "@/components/sections/LatestNews";
import EventsSection from "@/components/sections/EventsSection";
import NotesSection from "@/components/sections/NotesSection";
import MediaGallery from "@/components/sections/MediaGallery";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <HeroSection />
      <DepartmentIntro />
      <QuickLinks />
      <AboutUs />
      <LatestNews />
      <EventsSection />
      <NotesSection />
      <MediaGallery />
      <ContactSection />
    </div>
  );
}
