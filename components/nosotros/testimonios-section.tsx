// Testimonios en video. Para agregar uno, añade su ID de YouTube (lo que va después de "v=") a la lista.
const videos = [
  { id: "yCZ1LV6FtJ4", titulo: "Historias que inspiran" },
];

export function TestimoniosSection() {
  return (
    <section id="testimonios" aria-labelledby="testimonios-titulo" className="bg-white pt-(--header-offset)">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
              Testimonios
            </p>
            <h1
              id="testimonios-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Historias que inspiran
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Escucha de primera mano las voces de las familias y los niños que hacen parte de Senderos de Esperanza.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {videos.map((video) => (
              <div key={video.id} className="aspect-video w-full overflow-hidden rounded-lg shadow-xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?fs=0`}
                  title={video.titulo}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
