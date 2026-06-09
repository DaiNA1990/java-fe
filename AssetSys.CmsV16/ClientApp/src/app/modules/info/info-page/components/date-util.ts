// date-util.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend plugin 1 lần duy nhất
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const parseFormats = [
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'DD-MM-YYYY',
  'YYYY-MM-DDTHH:mm:ssZ',
  'DD/MM/YYYY HH:mm:ss'
];

export function parseDate(value: any): Date | null {
  if (!value) return null;

  // 1) Đầu tiên thử ISO
  let d = dayjs(value);

  // 2) Nếu không phải ISO, thử các format custom
  if (!d.isValid()) {
    for (const f of parseFormats) {
      const tryDate = dayjs(value, f, true);
      if (tryDate.isValid()) {
        d = tryDate;
        break;
      }
    }
  }

  return d.isValid() ? d.toDate() : null;
}

export const dateUtil = {
  parseDate,
  dayjs
};
