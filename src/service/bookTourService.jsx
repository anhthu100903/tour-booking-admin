import axios from 'axios';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:8080/tour/booking';

// Hàm lấy thông tin các booking tour
export const getBookingInfo = async (page, pageSize, token) => {
  try {
      // Gửi yêu cầu GET với tham số phân trang
      const response = await axios.get(`${BASE_URL}/page/info`, {
          params: {
              page: page,
              pageSize: pageSize,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      
      // Kiểm tra mã lỗi trong response
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