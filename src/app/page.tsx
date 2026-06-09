import Navbar from "@/components/Navbar";
import PoptavkaSection from "@/components/sections/PoptavkaSection";
import AboutSection from "@/components/sections/AboutSection";
import WorksSection from "@/components/sections/WorksSection";
import ServicesSection from "@/components/sections/ServicesSection";
import KontaktSection from "@/components/sections/KontaktSection";
import { getWorks } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function Home() {
  const works = await getWorks();

  return (
    <>
      <Navbar />
      <main>
        <PoptavkaSection />
        <ServicesSection />
        <WorksSection works={works} />
        <AboutSection />
        <KontaktSection />
      </main>
    </>
  );
}
