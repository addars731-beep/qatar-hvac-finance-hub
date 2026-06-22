export const QAR = (n: number | null | undefined) => {
  const v = Number(n ?? 0);
  return new Intl.NumberFormat("en-QA", {
    style: "currency",
    currency: "QAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
};

export const formatDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
};

export const formatNumber = (n: number | null | undefined, frac = 2) =>
  new Intl.NumberFormat("en-QA", { minimumFractionDigits: frac, maximumFractionDigits: frac }).format(Number(n ?? 0));