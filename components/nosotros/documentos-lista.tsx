"use client";

import { useState } from "react";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Documento = {
  title: string;
  /** Enlace de Google Drive del archivo (el mismo que se comparte con "Cualquier persona con el enlace"). */
  href: string;
};

/** Extrae el id de un enlace de Drive: https://drive.google.com/file/d/<id>/view */
function idDrive(href: string) {
  return href.match(/\/d\/([^/?#]+)/)?.[1] ?? null;
}

/** Lista de documentos con visor en línea: el PDF se lee dentro de la página, sin salir del sitio. */
export function DocumentosLista({ documentos }: { documentos: Documento[] }) {
  const [abierto, setAbierto] = useState<Documento | null>(null);
  const idAbierto = abierto ? idDrive(abierto.href) : null;

  return (
    <>
      <ul className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        {documentos.map((doc) => {
          const id = idDrive(doc.href);
          return (
            <li
              key={doc.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#dfeee0] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2e7d32]/40 hover:shadow-lg"
            >
              {/* Portada del documento */}
              <div className="flex items-center gap-4 bg-gradient-to-br from-[#eafaf3] to-[#f7f1d0] p-6">
                <span className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-white shadow-md ring-1 ring-black/5">
                  <FileText className="h-7 w-7 text-[#2e7d32]" aria-hidden="true" />
                  <span className="mt-1 text-[10px] font-extrabold tracking-wider text-[#c62828]">PDF</span>
                </span>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold leading-snug text-[#1f2430]">{doc.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">Documento oficial · Consulta pública</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-auto flex flex-wrap gap-3 p-5">
                <button
                  type="button"
                  onClick={() => setAbierto(doc)}
                  disabled={!id}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2e7d32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1b5e20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32] disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Ver en línea
                  <span className="sr-only">: {doc.title}</span>
                </button>
                {id && (
                  <a
                    href={`https://drive.google.com/uc?export=download&id=${id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2e7d32]/30 px-5 py-2.5 text-sm font-semibold text-[#2e7d32] transition-colors hover:bg-[#eafaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32]"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Descargar
                    <span className="sr-only">: {doc.title}</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Visor en línea */}
      <Dialog open={!!abierto} onOpenChange={(open) => !open && setAbierto(null)}>
        <DialogContent className="flex h-[90vh] max-w-[calc(100%-1rem)] flex-col gap-3 p-4 sm:max-w-5xl sm:p-5">
          <DialogHeader className="pr-8">
            <DialogTitle className="text-base sm:text-lg">{abierto?.title}</DialogTitle>
            <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
              Documento oficial de Senderos de Esperanza.
              {abierto && (
                <a
                  href={abierto.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#2e7d32] hover:underline"
                >
                  Abrir en pestaña nueva
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </DialogDescription>
          </DialogHeader>
          {idAbierto && (
            <iframe
              src={`https://drive.google.com/file/d/${idAbierto}/preview`}
              title={abierto?.title}
              className="min-h-0 w-full flex-1 rounded-lg border bg-slate-100"
              allow="autoplay"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
