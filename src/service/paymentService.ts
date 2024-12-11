import axios from 'axios';

const BASE_URL = "http://localhost:8080/tour/payment"
// Hàm cập nhật trạng thái payment
export const updatePaymentStatus = async (paymentId: number, status: boolean, token: string) => {
  try {
    // Chuyển `status` thành query string thay vì đưa vào body
    const response = await axios.put(
      `${BASE_URL}/${paymentId}/status`, 
      null,  // Không cần body cho PUT, chỉ cần query string
      {
        params: {
          status: status,  // Thêm tham số `status` vào query string
        },
        headers: {
          'Authorization': `Bearer ${token}`,  // Thêm token vào header Authorization
        },
      }
    );

    // Kiểm tra phản hồi từ API
    if (response.status === 200) {
      console.log('Payment status updated successfully:', response.data);
      return response.data.result; // Trả về dữ liệu phản hồi từ API
    } else {
      throw new Error('Failed to update payment status');
    }
  } catch (error) {
    // Xử lý lỗi
    if (axios.isAxiosError(error)) {
      console.error('Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};
