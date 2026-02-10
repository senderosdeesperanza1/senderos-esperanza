"use client";

import { useState } from "react";
import Image from "next/image";

export function GaleriaSection() {
  const images = [
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759165774/Galery_1_cl9jle.jpg",
      alt: "Momento de la galería 1",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759165866/Galery_2_ozmurc.jpg",
      alt: "Momento de la galería 2",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759165937/Galery_3_xef5bb.jpg",
      alt: "Momento de la galería 3",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166103/Galery_4_clhdhw.jpg",
      alt: "Momento de la galería 4",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166138/Galery_5_pqn41u.jpg",
      alt: "Momento de la galería 5",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166181/Galery_6_ckoe2y.jpg",
      alt: "Momento de la galería 6",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166216/Galery_7_pb3s9s.jpg",
      alt: "Momento de la galería 7",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166250/Galery_8_r70bx7.jpg",
      alt: "Momento de la galería 8",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166280/Galery_9_fpvjsc.jpg",
      alt: "Momento de la galería 9",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166363/Galery_10_ijv3t0.jpg",
      alt: "Momento de la galería 10",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166391/Galery_11_umvrim.jpg",
      alt: "Momento de la galería 11",
    },
    {
      src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759166433/Galery_12_yr8kee.jpg",
      alt: "Momento de la galería 12",
    },
  ];

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="galeria" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Nuestra Galería</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Un vistazo a las sonrisas, el esfuerzo y la esperanza que
            construimos juntos cada día.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-[#f4c542]"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={images[selectedImage].src || "/placeholder.svg"}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}
