/**
 * Gom các @Input mang tính "ngữ cảnh" của form động vào một object, thay vì khai
 * rời từng cái trên template.
 *
 * Không đưa `parentData` / `formData` / `formItem` / `formCtrl` vào đây:
 * - `parentData` và `formData` lấy từ getter `value` nên sinh object mới mỗi chu
 *   kỳ change detection, đưa vào sẽ phá memo.
 * - `formItem` / `formCtrl` khác nhau theo từng control trong ngFor.
 */
export interface FormConfig {
  layoutModule: string | null;
  layoutCode: string | null;
  layoutId: number | null;

  /** Bản ghi chắc chắn thuộc về component nhận config (modal edit, hoặc table đã tự tính). */
  dataId: number | null;
  /** parentId đã tính sẵn — table dùng trực tiếp. */
  parentId: number | null;

  /**
   * Dữ liệu thô của form cha. Form con tự quyết định dùng hay bỏ, vì với control
   * loại `layout` thì `item.layout` là layout SỞ HỮU chứ không phải layout được
   * tham chiếu — cha không biết group thật của con cho tới khi con fetch layout.
   */
  passGroupId: number | null;
  passDataId: number | null;
  passParentId: number | null;

  /**
   * Chế độ form ('VIEW', …). Phải đi qua config chứ không chờ event FORM_REFRESH,
   * nếu không form sẽ render enable một nhịp rồi mới chuyển disable.
   */
  formType: string | null;

  identifyId: string | null;
  readOnly: any;

  /**
   * Modal (InfoPageModalComponent) đang chứa form này, kể cả lồng nhiều cấp.
   * Form con dùng để tự đăng ký, nhờ đó modal biết được dữ liệu trong nó đã bị
   * sửa hay chưa và tìm được nút submit — vì mỗi form là một FormGroup riêng.
   */
  ownerModal: any | null;
}

/**
 * Giữ nguyên reference cũ nếu mọi field bằng nhau.
 *
 * BẮT BUỘC dùng ở mọi chỗ tạo FormConfig. Nếu bind thẳng object literal trên
 * template thì reference đổi mỗi chu kỳ change detection, setter `config` sẽ
 * chạy liên tục và gán đè `dataId` của form con về giá trị của form cha — xoá
 * mất kết quả `loadForm()`.
 */
export function keepConfig(
  prev: FormConfig | null | undefined,
  next: FormConfig
): FormConfig {
  if (
    prev &&
    (Object.keys(next) as (keyof FormConfig)[]).every((k) => prev[k] === next[k])
  )
    return prev;
  return next;
}
