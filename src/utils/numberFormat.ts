export function sanitizeNumber(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatNumber(value: string): string {
  if (!value) return "";

  const numeric = typeof value === "string" ? parseInt(value, 10) : value;
  if (isNaN(numeric)) return "";

  return numeric.toLocaleString("pt-BR");
}
