import axios, { AxiosResponse } from 'axios';

// Định nghĩa kiểu cho kết quả trả về từ API
interface Tour {
  id: number;
  name: string;
  // Thêm các trường khác mà bạn cần từ đối tượng tour
}

interface GetAllToursResponse {
  code: number;
  message: string;
  result: Tour[]; // Mảng các tour
}

const BASE_URL = 'http://localhost:8080/tour/tours';

/**
 * Lấy danh sách tất cả các tour với phân trang.
 * @param limit - Số lượng tour mỗi trang
 * @param offset - Vị trí bắt đầu (offset) cho trang
 * @param token - Token xác thực người dùng
 * @returns Promise<GetAllToursResponse> - Kết quả trả về chứa danh sách tour
 */
const getAllToursWithPagination = async (
  limit: number,
  offset: number,
  token: string
): Promise<Tour[]> => {
  try {
    const response: AxiosResponse<GetAllToursResponse> = await axios.get(
      `${BASE_URL}/pagination`,
      {
        headers: {
          "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
          Authorization: `Bearer ${token}`, // Thêm header xác thực
        },
        params: {
          limit: limit,
          offset: offset,
        },
      }
    );

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Đã xảy ra lỗi trong quá trình lấy dữ liệu tour");
    }

    return response.data.result; // Trả về mảng các tour
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};


/**
 * Lấy danh sách tất cả các tour với phân trang.
 * @param limit - Số lượng tour mỗi trang
 * @param offset - Vị trí bắt đầu (offset) cho trang
 * @param token - Token xác thực người dùng
 * @returns Promise<GetAllToursResponse> - Kết quả trả về chứa danh sách tour
 */
const getAllTours = async (
  token: string
): Promise<Tour[]> => {
  try {
    const response: AxiosResponse<GetAllToursResponse> = await axios.get(BASE_URL,
      {
        headers: {
          "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
          Authorization: `Bearer ${token}`, // Thêm header xác thực
        }
      }
    );

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Đã xảy ra lỗi trong quá trình lấy dữ liệu tour");
    }

    return response.data.result; // Trả về mảng các tour
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

export {
  getAllTours,
  getAllToursWithPagination
};
