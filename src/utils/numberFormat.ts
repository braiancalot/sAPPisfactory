export function sanitizeNumericInput(value: string): string {
  if (!value) return "";

  let sanitized = value.replace(/\./g, ",");

  sanitized = sanitized.replace(/[^\d,]/g, "");

  const parts = sanitized.split(",");
  if (parts.length > 2) {
    sanitized = parts[0] + "," + parts.slice(1).join("");
  }

  if (sanitized.startsWith(",")) {
    sanitized = "0" + sanitized;
  }

  return sanitized;
}

export function parsePtBrNumber(value: string): number {
  if (!value) return NaN;

  const normalized = value.replace(/\./g, "").replace(",", ".");

  return parseFloat(normalized);
}

export function formatPtBrNumber(value: number | string): string {
  let numericValue: number;

  if (typeof value === "string") {
    numericValue = parsePtBrNumber(value);
  } else {
    numericValue = value;
  }

  if (isNaN(numericValue)) return "";

  return numericValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  });
}
