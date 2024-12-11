import axios from 'axios';
import { AllPaymentResponse } from 'src/sections/book-tour/bookingInterface';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:8080/tour/booking';

// Định nghĩa kiểu trả về từ API
interface BookingInfo {
    // Các trường tùy thuộc vào dữ liệu thực tế của API
    id: number;
    name: string;
    date: string;
    status: string;
}

interface BookingResponse {
    code: number;
    result: BookingInfo[];
}

// Hàm lấy thông tin các booking tour
export const getBookingInfo = async (
    page: number,
    pageSize: number,
    token: string
  ): Promise<AllPaymentResponse> => {
    try {
      const response = await axios.get<{ code: number; result: AllPaymentResponse }>(
        `${BASE_URL}/page/info`,
        {
          params: {
            page,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.code === 1000) {
        return response.data.result;
      } else {
        throw new Error('Failed to fetch booking data');
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      throw error;
    }
  };