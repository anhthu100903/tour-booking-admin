import axios, { AxiosResponse } from 'axios';
import { TypeDTO } from 'src/sections/tour/type';
const BASE_URL = 'http://localhost:8080/tour/types';

// Định nghĩa kiểu dữ liệu cho phản hồi API

interface ApiResponse {
  code: number;
  message: string;
  result: TypeDTO[];
}

/**
 * Lấy danh sách tất cả các loại tour.
 * @param {string} token - Token xác thực
 * @returns {Promise<TourType[]>} - Kết quả danh sách loại tour
 */
const getAllTourTypes = async (token: string): Promise<TypeDTO[]> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
        Authorization: `Bearer ${token}`, // Thêm header xác thực
      },
    });

    console.log(response);

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "Đã xảy ra lỗi khi lấy thông tin loại tour.");
    }

    return response.data.result; // Trả về danh sách loại tour
  } catch (error) {
    console.error("Error get tour type info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

export {
  getAllTourTypes
};
