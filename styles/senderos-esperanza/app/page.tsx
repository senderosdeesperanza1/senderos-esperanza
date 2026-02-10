import { Header } from "@/components/header";
import { HeroSlider } from "@/components/hero-slider";
import { NosotrosSection } from "@/components/nosotros-section";
import { ProgramasSection } from "@/components/programas-section";
import NoticiasSection from "@/components/noticias-section";
import { GaleriaSection } from "@/components/galeria-section";
import { ContactoSection } from "@/components/contacto-section";
import DonarSection from "@/components/donar-section";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSlider />
      <NosotrosSection />
      <ProgramasSection />
      <NoticiasSection />
      <GaleriaSection />
      <ContactoSection />
      <DonarSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
