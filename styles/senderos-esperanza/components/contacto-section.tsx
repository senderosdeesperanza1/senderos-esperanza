"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function ContactoSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      content: "CARRERA 93 B # 34 SUR-97, Bogotá, Colombia",
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+57 3166852562",
    },
    {
      icon: Mail,
      title: "Email",
      content: "senderosdeesperanza1@gmail.com",
    },
    {
      icon: Clock,
      title: "Horario",
      content: "Lunes a Viernes: 8:00 AM - 5:00 PM",
    },
  ];

  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Contáctanos</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            ¡Nos encantaría saber de ti! Si tienes preguntas, sugerencias o
            quieres colaborar, no dudes en escribirnos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#2e7d32] text-white flex items-center justify-center">
                  <info.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{info.title}</h3>
                  <p className="text-muted-foreground text-base">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mapa/Ubicación */}
          <div className="rounded-lg overflow-hidden h-96 lg:h-full bg-muted shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7015461842266!2d-74.1714005262117!3d4.6472243953275845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9c3511c50017%3A0x3ef8d04de7731541!2zQ3JhLiA5M2IgIyAzNCBTVVItMTUsIEtlbm5lZHksIEJvZ290w6EsIEQuQy4sIEJvZ290w6EsIEJvZ290w6EsIEQuQy4!5e0!3m2!1ses-419!2sco!4v1758911663114!5m2!1ses-419!2sco"
              className="w-full h-full object-cover"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la ubicación de la fundación"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
