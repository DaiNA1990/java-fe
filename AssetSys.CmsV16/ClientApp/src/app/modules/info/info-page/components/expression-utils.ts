import { Parser } from 'expr-eval';

export function evaluateExpression(expr: any): any {

  if (/^0\d+$/.test(expr.trim())) {
    return expr;
  }
  if (expr === 'new Date()') {
    return new Date();
  }
  if (expr == 'null' || expr == 'undefined') return null;
  if (expr === 'new Date().getFullYear()') expr = 'year()';
  if (expr === 'new Date().getFullYear() + 1') expr = 'nextYear()';
  if (expr === 'new Date().getMonth() + 1') expr = 'month()';
  if (expr === 'new Date().getDate()') expr = 'day()';
  if (expr === 'Date.now()') expr = 'now()';
  try {
    const parser = new Parser();
    const parsed = parser.parse(expr);
    return parsed.evaluate({
      year: () => new Date().getFullYear(),
      nextYear: () => new Date().getFullYear() + 1,
      month: () => new Date().getMonth() + 1,
      day: () => new Date().getDate(),
      now: () => Date.now(),
    });
  } catch (e) {
    //console.error('Lỗi:', e);
    return expr;
  }
}
