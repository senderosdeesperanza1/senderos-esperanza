import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#2e7d32]/10 to-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-[#2e7d32]" />
        </div>

        <h1 className="text-3xl font-bold text-[#2e7d32]">
          ¡Gracias por tu donación!
        </h1>

        <p className="text-gray-600 text-lg">
          Tu generosidad nos ayuda a seguir transformando vidas y construyendo
          senderos de esperanza para quienes más lo necesitan.
        </p>

        <p className="text-sm text-gray-500">
          Recibirás un correo electrónico con la confirmación de tu donación.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button className="bg-[#2e7d32] hover:bg-[#2e7d32]/90 text-white">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
