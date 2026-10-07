/**
 * FieldOps Pro - Calendar Utilities & Date Helpers
 * Timezone-aware date calculations for Dhaka Standard Time (BST / UTC+6)
 */

export const DAYS_OF_WEEK_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_OF_WEEK_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

/**
 * Format a Date to Bangladesh Dhaka Time or English string
 */
export function formatCalendarDate(date: Date, locale: string = 'en'): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = locale === 'bn' ? MONTHS_BN[d.getMonth()] : MONTHS_EN[d.getMonth()];
  const year = d.getFullYear();

  if (locale === 'bn') {
    const toBnDigits = (n: number | string) =>
      String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
    return `${toBnDigits(day)} ${month}, ${toBnDigits(year)}`;
  }

  return `${month} ${day}, ${year}`;
}

/**
 * Format hours and minutes to 12-hour AM/PM string
 */
export function formatTime12H(date: Date, locale: string = 'en'): string {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? (locale === 'bn' ? 'অপরাহ্ন' : 'PM') : (locale === 'bn' ? 'পূর্বাহ্ন' : 'AM');
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  if (locale === 'bn') {
    const toBnDigits = (n: number | string) =>
      String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
    return `${toBnDigits(hours)}:${toBnDigits(minStr)} ${ampm}`;
  }

  return `${hours}:${minStr} ${ampm}`;
}

/**
 * Get start of the week (Sunday)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get 7 days for the current week
 */
export function getWeekDays(currentDate: Date): Date[] {
  const start = getStartOfWeek(currentDate);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }
  return days;
}

/**
 * Get all 35-42 calendar days for month grid view
 */
export function getMonthGridDays(currentDate: Date): Date[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0-6

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDayOfWeek);
  startDate.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  // 6 weeks * 7 days = 42 slots
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }

  return days;
}

/**
 * Check if two dates represent the same calendar day
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format duration into human readable string
 */
export function formatDuration(durationMins: number, locale: string = 'en'): string {
  const hrs = Math.floor(durationMins / 60);
  const mins = durationMins % 60;

  if (locale === 'bn') {
    const toBnDigits = (n: number | string) =>
      String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
    if (hrs > 0 && mins > 0) return `${toBnDigits(hrs)} ঘণ্টা ${toBnDigits(mins)} মিনিট`;
    if (hrs > 0) return `${toBnDigits(hrs)} ঘণ্টা`;
    return `${toBnDigits(mins)} মিনিট`;
  }

  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${mins} min`;
}
