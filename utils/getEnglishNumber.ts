export function getEnglishNumber(value: string): number {
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  const enDigits = "0123456789";

  const converted = value.replace(
    /[۰-۹]/g,
    (d) => enDigits[faDigits.indexOf(d)]
  );

  return Number(converted);
}
