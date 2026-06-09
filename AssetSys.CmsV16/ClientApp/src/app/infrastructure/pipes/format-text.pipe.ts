// Angular
import { DatePipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
// Object-Path
import * as objectPath from 'object-path';
import dayjs from 'dayjs';

/**
 * Returns object from parent object
 */
@Pipe({
  name: 'formatText',
})
export class FormatTextPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param value: any
   * @param args: any
   */
  transform(value: any, typeData?: any): any {
    const type = this.detectDateType(value);
    if (type === 'iso') {
      return dayjs(value).format('DD/MM/YYYY');
    }

    if (type === 'pure-date') {
      // xác định format đầu vào
      if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(value)) {
        return dayjs(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
      }
      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(value)) {
        return dayjs(value, 'DD-MM-YYYY').format('DD/MM/YYYY');
      }
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
        return dayjs(value, 'DD/MM/YYYY').format('DD/MM/YYYY');
      }
    }

    if (typeData !== undefined && typeData !== null && typeData === 'number')
      return !isNaN(parseInt(value)) ? parseInt(value).toLocaleString() : '';

    if (typeData !== undefined && typeData !== null && typeData === 'decimal')
      return !isNaN(parseFloat(value))
        ? parseFloat(value).toLocaleString()
        : '';

    if (typeData !== undefined && typeData !== null && typeData === 'currency')
      return !isNaN(parseInt(value)) ? parseInt(value).toLocaleString() : '';

    return value;
  }
  detectDateType(value: any): 'iso' | 'pure-date' | 'text' {
    if (typeof value !== 'string') return 'text';

    const trimmed = value.trim();

    // ISO 8601: YYYY-MM-DDT...
    if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
      return 'iso';
    }

    // Ngày thuần túy (yyyy-MM-dd)
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
      return 'pure-date';
    }

    // Ngày thuần túy (dd-MM-yyyy)
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
      return 'pure-date';
    }

    // Ngày thuần túy (dd/MM/yyyy)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      return 'pure-date';
    }

    return 'text';
  }
}
