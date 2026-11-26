export function formatPrice(n) {
    return new Intl.NumberFormat('vi-VN').format(n) + ' ₫'; // 1290000 → 1.290.000 ₫
}