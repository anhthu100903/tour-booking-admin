import axios from 'axios';
import api from './axiosInstance';

const BASE_URL = 'http://localhost:8080/tour/chart';

// Định nghĩa kiểu cho phản hồi API
interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Định nghĩa kiểu cho kết quả trả về của chartBookType
interface ChartBookTypeResult {
  // Thêm các trường dữ liệu của result ở đây
  // Ví dụ: bookCount: number;
}

// Định nghĩa kiểu cho kết quả trả về của chartDoanhThu
interface ChartDoanhThuResult {
  // Thêm các trường dữ liệu của result ở đây
  // Ví dụ: revenue: number;
}

/**
 * Hàm lấy dữ liệu loại tour từ API
 * @param token - Token xác thực của người dùng
 * @returns {Promise<ChartBookTypeResult>} - Kết quả từ API
 */
const chartBookType = async (token: string): Promise<ChartBookTypeResult> => {
  try {
    const response = await axios.get<ApiResponse<ChartBookTypeResult>>(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thay yourAccessToken bằng token của bạn
      }
    });

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Đã xảy ra lỗi trong quá trình lấy user");
    }

    return response.data.result; // Trả về kết quả thông tin loại tour
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

/**
 * Hàm lấy doanh thu từ API
 * @param token - Token xác thực của người dùng
 * @returns {Promise<ChartDoanhThuResult>} - Kết quả từ API
 */
const chartDoanhThu = async (token: string): Promise<ChartDoanhThuResult> => {
  try {
    const response = await api.get<ApiResponse<ChartDoanhThuResult>>(`/payment/revenue`, {
      headers: {
        Authorization: `Bearer ${token}` // Thay yourAccessToken bằng token của bạn
      }
    });

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Đã xảy ra lỗi trong quá trình lấy doanh thu");
    }

    return response.data.result; // Trả về thông tin doanh thu
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

export {
  chartBookType,
  chartDoanhThu
};
