export function getSafeRedirectTo(value: string | null, fallback = "/app") {
  if (!value) return fallback;
  if (value.includes("\\")) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}
