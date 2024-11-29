import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tour/chart';

/**
 * @returns {Promise<object>} 
 */
const chartBookType = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}` // Thay yourAccessToken bằng token của bạn
      }
    });

    if (response.data.code !== 1000) {
      throw new Error(data.message || "Đã xảy ra lỗi trong quá trình lấy user");
    }

    return response.data.result // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};


/**
 * @returns {Promise<object>} 
 */
const chartDoanhThu = async (token) => {
  try {
    const response = await axios.get(`http://localhost:8080/tour/payment/revenue`, {
      headers: {
        Authorization: `Bearer ${token}` // Thay yourAccessToken bằng token của bạn
      }
    });

    if (response.data.code !== 1000) {
      throw new Error(data.message || "Đã xảy ra lỗi trong quá trình lấy user");
    }

    return response.data.result // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

export {
  chartBookType,
  chartDoanhThu
}