// Cifras de la corporación. Se usan en Inicio y en Nosotros > Impacto: cámbialas aquí una sola vez.

// Año de fundación de la corporación
export const ANIO_FUNDACION = 2007;

export const NINOS_ATENDIDOS = 300;
export const FAMILIAS_BENEFICIADAS = 200;

export function aniosDeTrayectoria() {
  return new Date().getFullYear() - ANIO_FUNDACION;
}
