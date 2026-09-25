"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export type TocGroup = {
  label: string;
  items: { id: string; number: string; title: string }[];
};

export function LegalToc({ groups }: { groups: TocGroup[] }) {
  const [activo, setActivo] = useState<string>(groups[0]?.items[0]?.id ?? "");

  useEffect(() => {
    const ids = groups.flatMap((g) => g.items.map((i) => i.id));
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting);
        if (visibles.length > 0) {
          const primero = visibles.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
          setActivo(primero.target.id);
        }
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups]);

  const lista = (
    <div className="space-y-6">
      {groups.map((grupo) => (
        <div key={grupo.label}>
          <p className="px-3 text-xs font-bold uppercase tracking-[0.14em] text-[#1b5e20]">
            {grupo.label}
          </p>
          <ul className="mt-2 space-y-0.5">
            {grupo.items.map((item) => {
              const esActivo = activo === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={esActivo ? "true" : undefined}
                    className={`flex gap-2.5 rounded-lg border-l-2 px-3 py-1.5 text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32] ${
                      esActivo
                        ? "border-[#f4c542] bg-[#eafaf3] font-semibold text-[#1b5e20]"
                        : "border-transparent text-[#4a5650] hover:bg-[#f5f9f6] hover:text-[#1b5e20]"
                    }`}
                  >
                    <span className="w-5 shrink-0 tabular-nums text-[#2e7d32]/70">{item.number}</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <nav aria-label="Contenido del documento">
      {/* Móvil: desplegable */}
      <details className="group rounded-2xl border border-[#cfe8d2] bg-white shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold text-[#1b5e20] [&::-webkit-details-marker]:hidden">
          Contenido del documento
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="border-t border-[#cfe8d2] p-3">{lista}</div>
      </details>

      {/* Escritorio: barra lateral fija */}
      <div className="hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-[#cfe8d2] bg-white p-3 shadow-sm lg:block">
        <p className="px-3 pb-3 pt-2 text-sm font-bold text-foreground">Contenido</p>
        {lista}
      </div>
    </nav>
  );
}
