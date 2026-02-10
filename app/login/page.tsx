"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // Cambiamos username por email
  const [password, setPassword] = useState(""); // Mantenemos password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Enviamos email en lugar de username
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          data?.error ||
            "Credenciales incorrectas o error en el servidor. Intenta nuevamente.",
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");

      router.push("/admin/");
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative p-4"
      style={{ backgroundImage: "url('/fondo.jpeg')" }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-sm">
        {/* Card glassmorphism con logo arriba */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-8 py-6 relative">
          {/* Logo circular que sobresale */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <img
              src="/logo.png"
              className="w-24 h-24 object-cover rounded-full shadow-2xl border-4 border-white/40"
              alt="logo"
            />
          </div>

          {/* Espacio para el logo */}
          <div className="h-14"></div>

          {/* Título */}
          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            {/* INPUT EMAIL */}
            <div className="mb-5">
              <label className="block text-white/90 font-medium mb-1.5 text-sm">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email" // Cambiamos el tipo a 'email' para validación del navegador
                  className="w-full bg-transparent border-b-2 border-white/40 text-white text-sm py-2.5 pr-8 placeholder-white/60 focus:outline-none focus:border-white/80 transition"
                  placeholder="su-correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <User
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/80"
                  size={18}
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="mb-6">
              <label className="block text-white/90 font-medium mb-1.5 text-sm">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent border-b-2 border-white/40 text-white text-sm py-2.5 pr-8 placeholder-white/60 focus:outline-none focus:border-white/80 transition"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/40 text-white text-xs p-2.5 rounded-2xl mb-5">
                {error}
              </div>
            )}

            {/* BOTÓN INGRESAR */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 text-base rounded-full shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-xs text-white/80 hover:text-white hover:underline transition"
            >
              Volver al sitio web
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
