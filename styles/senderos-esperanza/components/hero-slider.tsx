"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Bienvenido a Corporación Senderos de Esperanza",
    description:
      "Construimos futuros brillantes a través de la educación, la solidaridad y el desarrollo comunitario.",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1760927747/Home_a3o7cq.jpg",
    showButton: true,
  },
  {
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1760928726/image_1_jq7lgn.png",
  },
  {
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759164956/Carousel_2_dudgsx.jpg",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleInteraction = (action: () => void) => {
    setPaused(true);
    action();
    setTimeout(() => setPaused(false), 5000); // Reanuda después de 5s de inactividad
  };

  return (
    <section
      id="inicio"
      className="relative h-[90vh] w-full"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Contenedor de slides */}
      <div className="relative h-full w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title || "Imagen de la comunidad"}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[7000ms] ease-in-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
              {slide.title && slide.description && (
                <div
                  className={`max-w-3xl transition-opacity duration-1000 ${
                    index === currentSlide
                      ? "opacity-100 animate-fade-in-up animate-duration-1000"
                      : "opacity-0"
                  }`}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link
                    href="#donar"
                    className={buttonVariants({
                      size: "lg",
                      className:
                        "bg-brand-yellow text-brand-green hover:bg-brand-yellow/90 font-semibold text-lg px-8 shadow-lg",
                    })}
                  >
                    Donar Ahora
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleInteraction(() => setCurrentSlide(index))}
            aria-label={`Ir al slide ${index + 1}`}
            className={`h-3 w-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Controles Prev/Next */}
      <button
        type="button"
        className="absolute top-0 bottom-0 left-0 z-30 flex items-center justify-center px-4 group focus:outline-none"
        onClick={() => handleInteraction(prevSlide)}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
          <ChevronLeft className="h-8 w-8 text-white" />
          <span className="sr-only">Anterior</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 bottom-0 right-0 z-30 flex items-center justify-center px-4 group focus:outline-none"
        onClick={() => handleInteraction(nextSlide)}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
          <ChevronRight className="h-8 w-8 text-white" />
          <span className="sr-only">Siguiente</span>
        </span>
      </button>
    </section>
  );
}
