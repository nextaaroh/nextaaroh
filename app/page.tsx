import HomeHero from "@/components/HomeHero";
import BannerCarousel from "@/components/BannerCarousel";
import QuickLinksGrid from "@/components/QuickLinksGrid";
import SessionBanner from "@/components/SessionBanner";
import ChatManagerCard from "@/components/ChatManagerCard";
import WebsiteServiceBanner from "@/components/WebsiteServiceBanner";
import ContinueLearning from "@/components/ContinueLearning";
import AiCoachBanner from "@/components/AiCoachBanner";
import HomeAdSection from "@/components/HomeAdSection";
import DailyQuoteCard from "@/features/daily-content/components/DailyQuoteCard";
import DailyLearningCard from "@/features/daily-content/components/DailyLearningCard";
import FeaturedOpportunitiesCarousel from "@/features/featured-opportunities/components/FeaturedOpportunitiesCarousel";
import TopWebsitesList from "@/features/daily-content/components/TopWebsitesList";
import DreamWallPreview from "@/features/dream-wall/components/DreamWallPreview";
import SocialChannels from "@/features/social/components/SocialChannels";
import HelpWidget from "@/features/ai-coach/components/HelpWidget";

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <BannerCarousel />
      <QuickLinksGrid />
      <SessionBanner />
      <ChatManagerCard />
      <WebsiteServiceBanner />
      <ContinueLearning />
      <AiCoachBanner />
      <HomeAdSection />
      <DailyQuoteCard />
      <DailyLearningCard />
      <FeaturedOpportunitiesCarousel />
      <TopWebsitesList />
      <DreamWallPreview />
      <SocialChannels />
      <HelpWidget />
    </div>
  );
}
