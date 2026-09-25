"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";
import { FileText, Loader2, Lock, ShieldCheck } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";

// === Configuración ===
const NIT = "900216738-1";
const MONTOS_SUGERIDOS = [20000, 50000, 100000, 200000];
const MONTO_MINIMO = 5000;
const MONTO_MAXIMO = 20000000;

// TODO: enlace a la política de tratamiento de datos personales (Ley 1581 de 2012).
// Mientras esté vacío, se muestra el texto sin enlace.
const POLITICA_DATOS_URL: string = "";

const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "NIT", label: "NIT" },
  { value: "PP", label: "Pasaporte" },
];

// Medios que se muestran como referencia (el pago se completa en el checkout seguro).
const mediosPago = [
  {
    name: "Nequi",
    logo: "https://logowik.com/content/uploads/images/nequi8774.logowik.com.webp",
  },
  {
    name: "PSE",
    logo: "https://bancoserfinanza.com/wp-content/uploads/2019/03/pse.png",
  },
];

function formatoCOP(n: number) {
  return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

type Errores = Partial<
  Record<"monto" | "nombre" | "correo" | "celular" | "documento" | "acepta", string>
>;

const inputBase =
  "h-12 w-full rounded-lg border bg-white px-4 text-base text-[#1f2430] placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32]";

function Campo({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#1f2430]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-desc`} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-desc`} className="mt-1.5 text-sm text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Paso({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <h3 className="flex items-center gap-3 text-xl font-bold text-[#1f2430]">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2e7d32] text-sm text-white"
        aria-hidden="true"
      >
        {numero}
      </span>
      {titulo}
    </h3>
  );
}

// --- Componente principal ---
export default function DonarSection() {
  const [monto, setMonto] = useState<number | "otro">(50000);
  const [montoOtro, setMontoOtro] = useState("");
  const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    celular: "",
    tipoDoc: "CC",
    documento: "",
  });
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const valor =
    monto === "otro" ? Number(montoOtro.replace(/\D/g, "")) : monto;
  const valorValido = valor >= MONTO_MINIMO && valor <= MONTO_MAXIMO;

  const cambiar =
    (campo: keyof typeof datos) =>
    (e: { target: { value: string } }) =>
      setDatos((d) => ({ ...d, [campo]: e.target.value }));

  function validar(): Errores {
    const e: Errores = {};
    if (!valor || valor < MONTO_MINIMO) {
      e.monto = `El aporte mínimo es ${formatoCOP(MONTO_MINIMO)}.`;
    } else if (valor > MONTO_MAXIMO) {
      e.monto = `El aporte máximo por este medio es ${formatoCOP(MONTO_MAXIMO)}.`;
    }
    if (datos.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
      e.correo = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    }
    if (!/^3\d{9}$/.test(datos.celular.replace(/\D/g, ""))) {
      e.celular = "Escribe tu celular de 10 dígitos, por ejemplo 3001234567.";
    }
    if (!/^[A-Za-z0-9]{5,15}$/.test(datos.documento.trim())) {
      e.documento = "Escribe tu número de documento, sin puntos ni espacios.";
    }
    if (!acepta) e.acepta = "Debes aceptar el tratamiento de tus datos para continuar.";
    return e;
  }

  async function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setErrorEnvio("");

    const e = validar();
    setErrores(e);
    const primero = (["monto", "nombre", "correo", "celular", "documento", "acepta"] as const).find(
      (k) => e[k],
    );
    if (primero) {
      document.getElementById(`campo-${primero}`)?.focus();
      return;
    }

    sendGAEvent("event", "donacion_form_submit", { valor });

    setEnviando(true);
    try {
      const res = await fetch("/api/donaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monto: valor,
          nombre: datos.nombre.trim(),
          correo: datos.correo.trim(),
          celular: datos.celular.replace(/\D/g, ""),
          tipoDoc: datos.tipoDoc,
          documento: datos.documento.trim(),
          acepta,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        setErrorEnvio(
          json.error ??
            "No pudimos iniciar tu donación. Inténtalo de nuevo en unos minutos.",
        );
        setEnviando(false);
        return;
      }
      window.location.assign(json.url);
    } catch {
      setErrorEnvio("No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.");
      setEnviando(false);
    }
  }

  const estiloOpcion =
    "flex h-14 cursor-pointer items-center justify-center rounded-xl border-2 border-[#dfeee0] bg-white px-2 text-base font-bold text-[#1f2430] transition-colors hover:border-[#2e7d32]/50 peer-checked:border-[#2e7d32] peer-checked:bg-[#eafaf3] peer-checked:text-[#1b5e20] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2e7d32] sm:text-lg";

  return (
    <section
      id="donar"
      aria-labelledby="donar-titulo"
      className="scroll-mt-(--header-offset) bg-[#f5faf6] py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-[#ff5722] md:text-5xl">Esta En Desarrollo
            </h1>
            <h1
              id="donar-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Haz tu donación
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              En pocos pasos, tu aporte se convierte en alimentación, educación y
              acompañamiento para niños y familias. Elige el valor, completa tus
              datos y paga de forma segura.
            </p>
          </div>

          {/* === Formulario de donación digital === */}
          <form
            onSubmit={enviar}
            noValidate
            className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12"
          >
            <div className="space-y-8 lg:col-span-7">
              {/* Paso 1: aporte */}
              <div className="rounded-2xl bg-white p-6 ring-1 ring-[#dfeee0] sm:p-8">
                <Paso numero={1} titulo="Elige tu aporte" />
                <fieldset className="mt-6">
                  <legend className="sr-only">Valor de tu aporte</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {MONTOS_SUGERIDOS.map((m) => (
                      <div key={m}>
                        <input
                          type="radio"
                          name="monto"
                          id={`monto-${m}`}
                          className="peer sr-only"
                          checked={monto === m}
                          onChange={() => {
                            setMonto(m);
                            setErrores((x) => ({ ...x, monto: undefined }));
                          }}
                        />
                        <label htmlFor={`monto-${m}`} className={estiloOpcion}>
                          {formatoCOP(m)}
                        </label>
                      </div>
                    ))}
                    <div className="col-span-2 sm:col-span-1">
                      <input
                        type="radio"
                        name="monto"
                        id="monto-otro"
                        className="peer sr-only"
                        checked={monto === "otro"}
                        onChange={() => setMonto("otro")}
                      />
                      <label htmlFor="monto-otro" className={estiloOpcion}>
                        Otro valor
                      </label>
                    </div>
                  </div>
                </fieldset>

                {monto === "otro" && (
                  <div className="mt-5">
                    <Campo
                      id="campo-monto"
                      label="¿Cuánto quieres donar?"
                      error={errores.monto}
                      hint={`Mínimo ${formatoCOP(MONTO_MINIMO)}.`}
                    >
                      <div className="relative">
                        <span
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500"
                          aria-hidden="true"
                        >
                          $
                        </span>
                        <input
                          id="campo-monto"
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="75.000"
                          value={
                            montoOtro
                              ? String(Number(montoOtro.replace(/\D/g, ""))).replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ".",
                                )
                              : ""
                          }
                          onChange={(e) => setMontoOtro(e.target.value.replace(/\D/g, ""))}
                          aria-invalid={!!errores.monto}
                          aria-describedby="campo-monto-desc"
                          className={`${inputBase} pl-8 ${errores.monto ? "border-red-500" : "border-[#cfe0d1]"}`}
                        />
                      </div>
                    </Campo>
                  </div>
                )}
              </div>

              {/* Paso 2: datos */}
              <div className="rounded-2xl bg-white p-6 ring-1 ring-[#dfeee0] sm:p-8">
                <Paso numero={2} titulo="Tus datos" />
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Campo id="campo-nombre" label="Nombre completo" error={errores.nombre}>
                      <input
                        id="campo-nombre"
                        type="text"
                        autoComplete="name"
                        value={datos.nombre}
                        onChange={cambiar("nombre")}
                        aria-invalid={!!errores.nombre}
                        aria-describedby="campo-nombre-desc"
                        className={`${inputBase} ${errores.nombre ? "border-red-500" : "border-[#cfe0d1]"}`}
                      />
                    </Campo>
                  </div>

                  <Campo id="campo-correo" label="Correo electrónico" error={errores.correo}>
                    <input
                      id="campo-correo"
                      type="email"
                      autoComplete="email"
                      value={datos.correo}
                      onChange={cambiar("correo")}
                      aria-invalid={!!errores.correo}
                      aria-describedby="campo-correo-desc"
                      className={`${inputBase} ${errores.correo ? "border-red-500" : "border-[#cfe0d1]"}`}
                    />
                  </Campo>

                  <Campo id="campo-celular" label="Celular" error={errores.celular}>
                    <input
                      id="campo-celular"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="3001234567"
                      value={datos.celular}
                      onChange={cambiar("celular")}
                      aria-invalid={!!errores.celular}
                      aria-describedby="campo-celular-desc"
                      className={`${inputBase} ${errores.celular ? "border-red-500" : "border-[#cfe0d1]"}`}
                    />
                  </Campo>

                  <Campo id="campo-tipoDoc" label="Tipo de documento">
                    <select
                      id="campo-tipoDoc"
                      value={datos.tipoDoc}
                      onChange={cambiar("tipoDoc")}
                      className={`${inputBase} border-[#cfe0d1]`}
                    >
                      {TIPOS_DOCUMENTO.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  <Campo
                    id="campo-documento"
                    label="Número de documento"
                    error={errores.documento}
                    hint="Lo usamos para generar tu certificado de donación."
                  >
                    <input
                      id="campo-documento"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={datos.documento}
                      onChange={cambiar("documento")}
                      aria-invalid={!!errores.documento}
                      aria-describedby="campo-documento-desc"
                      className={`${inputBase} ${errores.documento ? "border-red-500" : "border-[#cfe0d1]"}`}
                    />
                  </Campo>
                </div>

                <div className="mt-6">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      id="campo-acepta"
                      type="checkbox"
                      checked={acepta}
                      onChange={(e) => setAcepta(e.target.checked)}
                      aria-invalid={!!errores.acepta}
                      aria-describedby={errores.acepta ? "campo-acepta-desc" : undefined}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[#2e7d32]"
                    />
                    <span className="text-sm leading-relaxed text-slate-600">
                      Autorizo el tratamiento de mis datos personales para gestionar mi
                      donación, según la{" "}
                      {POLITICA_DATOS_URL ? (
                        <a
                          href={POLITICA_DATOS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#2e7d32] underline underline-offset-2"
                        >
                          política de tratamiento de datos
                        </a>
                      ) : (
                        "política de tratamiento de datos"
                      )}{" "}
                      de la Corporación Senderos de Esperanza.
                    </span>
                  </label>
                  {errores.acepta && (
                    <p
                      id="campo-acepta-desc"
                      role="alert"
                      className="mt-1.5 text-sm font-medium text-red-700"
                    >
                      {errores.acepta}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen y pago */}
            <aside className="lg:col-span-5">
              <div className="rounded-2xl bg-[#1b5e20] p-8 text-white lg:sticky lg:top-24 md:p-10">
                <p className="text-sm font-semibold text-white/80">Tu donación</p>
                <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight md:text-6xl">
                  {valorValido ? formatoCOP(valor) : "$0"}
                </p>
                <p className="mt-2 text-white/80">Aporte único</p>

                <ul className="mt-8 space-y-4 border-t border-white/20 pt-8">
                  <li className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="leading-snug text-white/90">
                      Pago seguro en la plataforma de Bold
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="leading-snug text-white/90">
                      Tus datos personales están protegidos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="leading-snug text-white/90">
                      Corporación Senderos de Esperanza · NIT {NIT}
                    </span>
                  </li>
                </ul>

                <div className="mt-8">
                  <p className="mb-3 text-sm font-semibold text-white/80">Medios de pago</p>
                  <ul className="flex flex-wrap items-center gap-2">
                    {mediosPago.map((medio) => (
                      <li
                        key={medio.name}
                        className="flex h-10 items-center rounded-lg bg-white px-3"
                      >
                        <Image
                          src={medio.logo}
                          alt={medio.name}
                          width={64}
                          height={28}
                          className="h-6 w-auto object-contain"
                        />
                      </li>
                    ))}
                    <li className="flex h-10 items-center rounded-lg bg-white px-3 text-sm font-semibold text-[#1b5e20]">
                      Tarjetas
                    </li>
                  </ul>
                </div>

                {errorEnvio && (
                  <p
                    role="alert"
                    className="mt-6 rounded-lg bg-white p-3 text-sm font-medium leading-relaxed text-red-700"
                  >
                    {errorEnvio}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-lg font-bold text-[#1b5e20] transition-colors hover:bg-[#eafaf3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {enviando ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Redirigiendo al pago…
                    </>
                  ) : valorValido ? (
                    `Donar ${formatoCOP(valor)}`
                  ) : (
                    "Donar"
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-white/70">
                  Serás redirigido a un checkout seguro para completar el pago.
                </p>
              </div>
            </aside>
          </form>

          {/* --- Sección de Donación Bancaria (sin cambios) --- */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="mt-16 pt-12 border-t">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">
                  Donaciones directas a nuestra cuenta Bancaria
                </h3>
                <p className="text-muted-foreground mt-2">
                  Haz tus donaciones a nombre de{" "}
                  <strong className="text-foreground">
                    Corporación Senderos de Esperanza
                  </strong>
                </p>
                <p className="font-mono text-sm text-muted-foreground mt-1">
                  NIT: 900216738-1
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6 rounded-xl border bg-muted/30 p-6 shadow-sm">
                <div className="shrink-0">
                  <Image
                    src="https://logowik.com/content/uploads/images/banco-caja-social8452.logowik.com.webp" // 👈 Asegúrate de guardar el logo aquí
                    alt="Logo Banco Caja Social"
                    width={80}
                    height={80}
                    className="rounded-md object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-lg">Banco Caja Social</h4>
                  <p className="text-muted-foreground">
                    <strong>Cuenta Corriente:</strong> Nº 21004432101
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}