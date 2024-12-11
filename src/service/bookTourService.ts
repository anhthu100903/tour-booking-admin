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

  interface Payment {
    amount: number;
    paymentName: string;
  }
  
  interface BookingRequest {
    numberOfAdult: number;
    numberOfChildren: number;
    numberOfBaby: number;
    departureDate: string;
    tourId: number;
    userId: number;
    payment: Payment;
  }
  
  // Hàm tạo booking
  export const createBooking = async (bookingData: BookingRequest) => {
    try {
      const response = await axios.post(BASE_URL, bookingData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;  // Nếu tạo booking thành công, trả về dữ liệu phản hồi
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
  };
  