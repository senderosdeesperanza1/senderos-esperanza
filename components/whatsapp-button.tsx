import Image from "next/image";
import Link from "next/link";

export function WhatsAppButton() {
  return (
    <Link
      href="https://wa.me/573023695873?text=Hola, visité tu pagina web y necesito mas información"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
      className="fixed bottom-10 right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25d366] shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
    >
      <Image src="/whatsapp.png" alt="WhatsApp" width={32} height={32} />
    </Link>
  );
}
