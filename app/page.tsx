import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PartnerSection from '../components/PartnerSection';

export default function Home() {
  return (
    <div className="font-sans text-gray-800 antialiased bg-white">
      <Hero />
      <HowItWorks />
      <PartnerSection />
    </div>
  );
}
