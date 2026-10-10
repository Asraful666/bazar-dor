const banglaNumber = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const banglaPercent = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

export function formatNumber(value: number) {
  return banglaNumber.format(value);
}

export function formatPercent(value: number) {
  return banglaPercent.format(Math.abs(value));
}

export function formatUnit(unit: string) {
  return `প্রতি ${units[unit] || unit}`;
}