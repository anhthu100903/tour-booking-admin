import axios, { AxiosResponse } from 'axios';
import { tourRequest, TypeDTO, Tour } from 'src/sections/tour/type';

// Định nghĩa kiểu cho kết quả trả về từ API
interface TourName {
  id: number;
  name: string;
}


interface Result {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  tours: Tour[];
}

interface GetAllToursWithPagination {
  code: number;
  message: string;
  result: Result; // Mảng các tour
}

interface GetAllToursResponse {
  code: number;
  message: string;
  result: TourName[]; // Mảng các tour
}

interface creatTourResponse {
  code: number;
  result: Tour; // tour
}

const BASE_URL = 'http://localhost:8080/tour/tours';


const getAllToursWithPagination = async (
  limit: number,
  offset: number,
  token: string
): Promise<Result> => {
  try {
    const response: AxiosResponse<GetAllToursWithPagination> = await axios.get(
      `${BASE_URL}/pagination`,
      {
        headers: {
          "Content-Type": "application/json", // Define Content-Type as JSON
          Authorization: `Bearer ${token}`, // Add authentication header
        },
        params: {
          limit: limit,
          offset: offset,
        },
      }
    );

    if (response.data.code !== 1000) {
      throw new Error(response.data.message || "An error occurred while fetching tour data");
    }

    return response.data.result; // Return the complete 'Result' object which includes pagination and tours
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error; // Throw the error for higher-level handling
  }
};

/**
 * Lấy danh sách tất cả các tour
 * @param token - Token xác thực người dùng
 * @returns Promise<GetAllToursResponse> - Kết quả trả về chứa danh sách tour
 */
const getAllTours = async (
  token: string
): Promise<TourName[]> => {
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


/**
 * Tạo một tour
 * @param token - Token xác thực người dùng
 * @returns Promise<TourWithPagination> - Kết quả trả về tour
 */
const createTour = async (
  token: string, 
  tour: tourRequest
): Promise<Tour> => {
  try {
    const response: AxiosResponse<creatTourResponse> = await axios.post(BASE_URL,
      tour,
      {
        headers: {
          "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
          Authorization: `Bearer ${token}`, // Thêm header xác thực
        }
      }
    );

    return response.data.result; // Trả về mảng các tour
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

export {
  getAllTours,
  getAllToursWithPagination,
  createTour
};
