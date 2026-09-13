"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useSWR from "swr";
import { ChevronLeft, ChevronRight, X, Maximize2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GaleriaItem {
  id?: string;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  imagen: string;
  fecha?: string;
}

const formatDate = (value?: string) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error cargando galería");
  return res.json();
};

export function GaleriaSection() {
  const { data: fotos = [], isLoading } = useSWR<GaleriaItem[]>("/api/galeria", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const [activeCategory, setActiveCategory] = useState("todas");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Extract all categories dynamically
  const categories = [
    "todas",
    ...Array.from(new Set(fotos.map((item) => (item.categoria || "").trim().toLowerCase()).filter(Boolean))),
  ];

  const filteredPhotos = fotos.filter((item) => {
    if (activeCategory === "todas") return true;
    return (item.categoria || "").trim().toLowerCase() === activeCategory.toLowerCase();
  });

  const handleNext = useCallback(() => {
    if (selectedImage === null || filteredPhotos.length === 0) return;
    setSelectedImage((prev) => ((prev ?? 0) + 1) % filteredPhotos.length);
  }, [selectedImage, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (selectedImage === null || filteredPhotos.length === 0) return;
    setSelectedImage((prev) => ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [selectedImage, filteredPhotos.length]);

  // Handle keyboard events for lightbox
  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handleNext, handlePrev]);

  const currentPhoto = selectedImage !== null ? filteredPhotos[selectedImage] : null;

  return (
    <section id="galeria" className="py-20 bg-muted/30 relative">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Nuestra Galería </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Un vistazo a las sonrisas, el esfuerzo y la esperanza que construimos juntos cada día.
          </p>
        </div>

        {/* Filtros de Categoría */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => {
              const label = cat === "todas" ? "Todas las Fotos" : cat.charAt(0).toUpperCase() + cat.slice(1);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    isActive
                      ? "bg-[#2e7d32] text-white shadow-md shadow-[#2e7d32]/20 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid de Fotos */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/3 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay fotos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="group relative aspect-4/3 overflow-hidden rounded-xl cursor-pointer bg-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={photo.imagen || "/placeholder.svg"}
                  alt={photo.titulo || "Foto de galería"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                  <div className="flex justify-end">
                    <span className="p-1.5 bg-black/40 backdrop-blur-xs text-white rounded-full">
                      <Maximize2 className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    {photo.categoria && (
                      <span className="inline-block px-2 py-0.5 bg-[#f4c542] text-[#2e7d32] rounded text-[11px] font-bold mb-1">
                        {photo.categoria}
                      </span>
                    )}
                    <h3 className="text-white text-xs sm:text-sm font-semibold line-clamp-1">
                      {photo.titulo || "Foto de la galería"}
                    </h3>
                    {photo.fecha && (
                      <p className="text-[10px] text-white/80 mt-1">{formatDate(photo.fecha)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox / Visor de Fotos */}
        {currentPhoto && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            {/* Botón Cerrar */}
            <button
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              onClick={() => setSelectedImage(null)}
              aria-label="Cerrar visor"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Flecha Anterior */}
            {filteredPhotos.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/80 transition-all z-20 border border-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Flecha Siguiente */}
            {filteredPhotos.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/40 hover:bg-black/80 transition-all z-20 border border-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Contenedor Central */}
            <div
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[75vh] w-full flex items-center justify-center">
                <img
                  src={currentPhoto.imagen || "/placeholder.svg"}
                  alt={currentPhoto.titulo || "Foto de galería"}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Pie de foto */}
              <div className="mt-4 text-center text-white max-w-2xl px-4">
                <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                  {currentPhoto.categoria && (
                    <span className="text-xs font-semibold text-[#f4c542] uppercase tracking-wider">
                      {currentPhoto.categoria}
                    </span>
                  )}
                  {currentPhoto.fecha && (
                    <span className="text-xs text-gray-400">
                      {currentPhoto.categoria ? "• " : ""}
                      {formatDate(currentPhoto.fecha)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {currentPhoto.categoria || currentPhoto.fecha ? "• " : ""}
                    {selectedImage! + 1} de {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="font-bold text-lg md:text-xl text-white">
                  {currentPhoto.titulo || "Foto de la galería"}
                </h3>
                {currentPhoto.descripcion && (
                  <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                    {currentPhoto.descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
