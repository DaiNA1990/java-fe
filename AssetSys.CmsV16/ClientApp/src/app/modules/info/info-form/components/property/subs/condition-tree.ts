// Dùng chung cho các popup cây điều kiện AND/OR (điều kiện dữ liệu / hiển thị / readonly)

const isConditionGroup = (rule: any) => Array.isArray(rule?.rules);

// sắp xếp theo cấp: điều kiện đơn lên trước, nhóm (AND/OR) xuống cuối, áp dụng đệ quy cho từng nhóm
// AND/OR có tính giao hoán nên đổi thứ tự không làm thay đổi kết quả
export function sortConditionRules(group: any) {
    if (!isConditionGroup(group)) return;

    group.rules = [
        ...group.rules.filter((r: any) => !isConditionGroup(r)),
        ...group.rules.filter((r: any) => isConditionGroup(r)),
    ];

    group.rules.filter(isConditionGroup).forEach((r: any) => sortConditionRules(r));
}

// chèn điều kiện đơn ngay sau điều kiện đơn cuối cùng (trước các nhóm) để giữ đúng thứ tự sắp xếp
export function insertConditionRule(group: any, rule: any) {
    const firstGroup = group.rules.findIndex(isConditionGroup);

    group.rules.splice(firstGroup === -1 ? group.rules.length : firstGroup, 0, rule);
}

// phân biệt cấp nhóm điều kiện giống màn Xây dựng giao diện: mỗi cấp 1 màu, lặp lại sau 6 cấp
export const CONDITION_TREE_STYLES = `
    .cond-group {
        --depth-color: 62, 151, 255;
        border: 1px dashed rgba(var(--depth-color), 0.45);
        border-left: 4px solid rgb(var(--depth-color));
        background-color: rgba(var(--depth-color), 0.05);
    }

    .cond-group[data-depth="1"] { --depth-color: 80, 205, 137; }
    .cond-group[data-depth="2"] { --depth-color: 114, 57, 234; }
    .cond-group[data-depth="3"] { --depth-color: 246, 166, 9; }
    .cond-group[data-depth="4"] { --depth-color: 23, 193, 232; }
    .cond-group[data-depth="5"] { --depth-color: 241, 65, 108; }

    /* điều kiện đơn: nền trắng, vạch trái nhạt theo màu nhóm cha */
    .cond-rule {
        background-color: var(--bs-body-bg, #fff);
        border: 1px solid var(--bs-gray-200, #f1f1f4);
        border-left: 3px solid rgba(var(--depth-color), 0.5);
    }

    .cond-depth-badge {
        display: inline-block;
        min-width: 28px;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-align: center;
        color: #fff;
        background-color: rgb(var(--depth-color));
    }
`;
