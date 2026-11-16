// Formato de rangos de fecha para hojas de vida

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatearMes(valor: string): string {
  if (!valor) return "";
  const [anio, mes] = valor.split("-");
  const nombre = MESES[Number(mes) - 1];
  if (!anio || !nombre) return valor;
  return `${nombre} ${anio}`;
}

export function formatearRangoFecha(inicio: string, fin: string): string {
  const inicioFmt = formatearMes(inicio);
  const finFmt = !fin || fin === "actual" ? "actual" : formatearMes(fin);

  if (!inicioFmt) return finFmt;
  if (finFmt === "actual") return `${inicioFmt} – actual`;
  return `${inicioFmt} – ${finFmt}`;
}
