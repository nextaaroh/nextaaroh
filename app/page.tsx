import HomeHero from "@/components/HomeHero";
import BannerCarousel from "@/components/BannerCarousel";
import DailyQuoteCard from "@/features/daily-content/components/DailyQuoteCard";
import DailyLearningCard from "@/features/daily-content/components/DailyLearningCard";
import FeaturedOpportunitiesCarousel from "@/features/featured-opportunities/components/FeaturedOpportunitiesCarousel";
import TopWebsitesList from "@/features/daily-content/components/TopWebsitesList";
import DreamWallPreview from "@/features/dream-wall/components/DreamWallPreview";

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <BannerCarousel />
      <DailyQuoteCard />
      <DailyLearningCard />
      <FeaturedOpportunitiesCarousel />
      <TopWebsitesList />
      <DreamWallPreview />
    </div>
  );
}