"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Users } from "lucide-react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function NoticiasSection() {
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const {
    data: noticias = [],
    error,
    isLoading,
  } = useSWR("/api/noticias", fetcher, {
    refreshInterval: 30000,
  });

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "publicacion":
        return FileText;
      case "evento":
        return Calendar;
      case "actividad":
        return Users;
      default:
        return FileText;
    }
  };

  const getCategoryLabel = (categoria: string) => {
    switch (categoria) {
      case "publicacion":
        return "Publicación";
      case "evento":
        return "Evento";
      case "actividad":
        return "Actividad";
      default:
        return "Noticia";
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "publicacion":
        return "bg-blue-500";
      case "evento":
        return "bg-[#2e7d32]";
      case "actividad":
        return "bg-[#f4c542]";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section id="noticias" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Noticias</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-balance leading-relaxed">
            Descubre nuestras últimas publicaciones, próximos eventos y
            actividades en curso.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e7d32]"></div>
              <p className="mt-4 text-muted-foreground">Cargando noticias...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">
                Error al cargar las noticias. Por favor, intenta de nuevo.
              </p>
            </div>
          )}

          {!isLoading && !error && noticias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay noticias disponibles en este momento.
              </p>
            </div>
          )}

          {!isLoading && !error && noticias.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia: any) => {
                const Icon = getCategoryIcon(noticia.categoria);
                return (
                  <Card
                    key={noticia.id}
                    className="border-2 hover:shadow-lg transition-shadow overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          noticia.imagen ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-4 left-4 ${getCategoryColor(
                          noticia.categoria,
                        )} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}
                      >
                        <Icon className="w-4 h-4" />
                        {getCategoryLabel(noticia.categoria)}
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {formatDate(noticia.fecha)}
                      </div>
                      <h4 className="font-bold text-lg mb-3 text-balance leading-tight">
                        {noticia.titulo}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 grow">
                        {noticia.descripcion}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-auto border-[#2e7d32] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white"
                        onClick={() => setSelectedNews(noticia)}
                      >
                        Leer Más
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedNews && (
        <Dialog
          open={!!selectedNews}
          onOpenChange={() => setSelectedNews(null)}
        >
          <DialogContent className="max-w-3xl p-0">
            <div className="relative h-64 md:h-80">
              <Image
                src={selectedNews.imagen}
                alt={selectedNews.titulo}
                fill
                className="rounded-t-lg object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <DialogHeader className="absolute bottom-0 left-0 p-6 text-left">
                <DialogTitle className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {selectedNews.titulo}
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="p-6 max-h-[40vh] overflow-y-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedNews.fecha)}
              </div>
              <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedNews.contenido}
              </div>
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-background/60 text-foreground backdrop-blur-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-6 w-6" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
