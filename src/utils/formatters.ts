/**
 * FieldOps Pro - Data Formatters
 * Formats numbers, BDT currency, percentages, durations, and dates in Bengali (bn-BD) and English (en-US).
 */

export const formatBDT = (amount: number = 0, locale: 'en' | 'bn' = 'en'): string => {
  const safeVal = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  if (locale === 'bn') {
    const formatted = new Intl.NumberFormat('bn-BD', {
      maximumFractionDigits: 0,
    }).format(safeVal);
    return `৳${formatted}`;
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(safeVal);
  return `৳${formatted}`;
};

export const formatNumber = (num: number = 0, locale: 'en' | 'bn' = 'en'): string => {
  const safeVal = typeof num === 'number' && !isNaN(num) ? num : 0;
  if (locale === 'bn') {
    return new Intl.NumberFormat('bn-BD').format(safeVal);
  }
  return new Intl.NumberFormat('en-US').format(safeVal);
};

export const formatPercentage = (rate: number = 0, locale: 'en' | 'bn' = 'en'): string => {
  const safeVal = typeof rate === 'number' && !isNaN(rate) ? rate : 0;
  const rounded = safeVal.toFixed(1);
  if (locale === 'bn') {
    return `${new Intl.NumberFormat('bn-BD').format(Number(rounded))}%`;
  }
  return `${rounded}%`;
};

export const formatDurationMins = (mins: number = 0, locale: 'en' | 'bn' = 'en'): string => {
  const safeMins = typeof mins === 'number' && !isNaN(mins) ? mins : 0;
  if (safeMins < 60) {
    return locale === 'bn' ? `${formatNumber(safeMins, 'bn')} মিনিট` : `${safeMins} min`;
  }
  const hours = Math.floor(safeMins / 60);
  const remainingMins = safeMins % 60;
  if (locale === 'bn') {
    return remainingMins > 0
      ? `${formatNumber(hours, 'bn')} ঘণ্টা ${formatNumber(remainingMins, 'bn')} মিনিট`
      : `${formatNumber(hours, 'bn')} ঘণ্টা`;
  }
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
};
