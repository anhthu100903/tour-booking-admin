export const KEY_TOKEN = "accessToken";
export const KEY_MY_INFO = "myInfo";

/**
 * Lưu trữ token vào localStorage
 * @param token - Token người dùng
 */
export const setToken = (token: string): void => {
  localStorage.setItem(KEY_TOKEN, token);
};

/**
 * Lấy token từ localStorage
 * @returns {string | null} - Trả về token nếu có, hoặc null nếu không có
 */
export const getToken = (): string | null => {
  return localStorage.getItem(KEY_TOKEN);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(KEY_TOKEN);
};
