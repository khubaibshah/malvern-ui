// src/utils/engineSizeFormat.ts

export function formatEngineSize(engineSize: string | number | undefined | null): string {
  const size = parseFloat(String(engineSize));
  if (!size || isNaN(size)) return 'N/A';
  return `${(size / 1000).toFixed(1)}L`;
}
