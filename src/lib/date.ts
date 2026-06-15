// Formats a date in a stable, locale-neutral way that matches the lowercase aesthetic.
// e.g. `2024-08-12` → `12 aug 2024`.
const SHORT_MONTHS_EN = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

export function formatPostDate(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = SHORT_MONTHS_EN[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// ISO 8601 for <time datetime="…"> and RSS.
export function toIsoDate(d: Date): string {
  return d.toISOString();
}
