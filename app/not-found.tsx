import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f5f8f5] px-4 pt-(--header-offset) text-[#1f2430]">
      <div className="max-w-md text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2e7d32]">
          404
        </p>
        <h1 className="mb-4 text-4xl font-black text-[#1f2430]">Página no encontrada</h1>
        <p className="mb-8 text-base text-slate-600">
          La sección que buscas no está disponible o ya no existe.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245d29]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
