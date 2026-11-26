import { HttpErrorResponse } from '@angular/common/http';
import { ResponseCode } from '../contants/app.enum';

/**
 * Chuẩn response của backend (áp dụng cho toàn bộ REST API qua gateway):
 *
 * - Thành công: HTTP 200/201, body { data, statusCode: 0, message, meta.traceId }.
 * - Lỗi: HTTP status thật (400/403/404/409/422/429/500...), body đổi hẳn shape
 *   thành { title, status, detail?, code, traceId, errors? }; detail và errors bị
 *   lược khỏi JSON khi không có giá trị nên luôn phải optional chaining.
 *
 * FE đang kiểm tra res.statusCode ở rất nhiều màn hình, nên lỗi được quy đổi
 * ngược về envelope cũ (statusCode khác 0 + message đã dịch) ngay tại
 * interceptor; thông tin mới (code, traceId, errors, retryAfter) giữ trong field
 * error cho nơi nào cần đọc.
 */
export interface ApiError {
  /** HTTP status thật của response. */
  status: number;
  /** Key i18n viết hoa, dùng để so sánh lỗi thay cho so chuỗi message. */
  code: string | null;
  /** Mô tả chi tiết, backend lược bỏ khỏi JSON khi không có. */
  detail: string | null;
  /** Mã đối chiếu log phía server, gửi kèm khi báo lỗi cho BE. */
  traceId: string | null;
  /** Lỗi theo từng field, chỉ có với lỗi validate (422). */
  errors: any[];
  /** Số giây nên chờ trước khi gọi lại, chỉ có với 429. */
  retryAfter: number | null;
}

export interface ApiResponse {
  data: any;
  statusCode: number;
  message: string;
  error: ApiError;
}

/**
 * Message hiển thị khi backend không trả title: lỗi mạng, gateway chặn, hoặc
 * response không phải JSON.
 */
const DEFAULT_MESSAGE: { [status: number]: string } = {
  400: 'Yêu cầu không hợp lệ, bạn vui lòng kiểm tra lại.',
  403: 'Bạn không có quyền thực hiện chức năng này.',
  404: 'Không tìm thấy dữ liệu.',
  409: 'Dữ liệu đã tồn tại.',
  422: 'Dữ liệu không hợp lệ, bạn vui lòng kiểm tra lại.',
  429: 'Bạn thao tác quá nhanh, vui lòng thử lại sau.',
};

const FALLBACK_MESSAGE = 'Kết nối không thành công, bạn vui lòng thử lại.';

/**
 * Body lỗi dưới dạng object.
 *
 * Request tải file dùng responseType blob nên body lỗi về dạng chuỗi JSON, phải
 * parse lại mới đọc được; không parse được thì trả null để dùng message mặc
 * định theo status.
 */
export function parseErrorBody(raw: any): any {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'object') return raw;

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  return null;
}

/** Quy đổi lỗi HTTP về envelope cũ để các màn hình đang đọc statusCode vẫn chạy. */
export function toApiResponse(
  error: HttpErrorResponse,
  body: any = null,
): ApiResponse {
  const data = parseErrorBody(body ?? error.error);
  const retryAfter = readRetryAfter(error);

  return {
    data: null,
    statusCode: ResponseCode.ONE,
    message: readMessage(error.status, data, retryAfter),
    error: {
      status: error.status,
      code: data?.code ?? null,
      detail: data?.detail ?? null,
      traceId: data?.traceId ?? null,
      errors: Array.isArray(data?.errors) ? data.errors : [],
      retryAfter,
    },
  };
}

function readMessage(
  status: number,
  data: any,
  retryAfter: number | null,
): string {
  if (data?.title) return data.title;

  if (status === 429 && retryAfter !== null)
    return `Bạn thao tác quá nhanh, vui lòng thử lại sau ${retryAfter} giây.`;

  return DEFAULT_MESSAGE[status] ?? FALLBACK_MESSAGE;
}

function readRetryAfter(error: HttpErrorResponse): number | null {
  const value = error.headers?.get('Retry-After');
  if (value === null || value === undefined || value === '') return null;

  const seconds = Number(value);
  return isNaN(seconds) ? null : seconds;
}
