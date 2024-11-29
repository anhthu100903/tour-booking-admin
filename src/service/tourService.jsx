import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tour/tours';

/**
 * Cập nhật thông tin người dùng (myInfo).
 * @param {string} token - Token xác thực người dùng
 * @param {object} limit 
 * @param {object} offset 
 * @returns {Promise<object>} - Kết quả cập nhật thông tin người dùng
 */
const getAllTours = async (limit, offset, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/pagination`, {
      headers: {
        "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
        Authorization: `Bearer ${token}`, // Thêm header xác thực
      },
      params: {
        limit: limit,
        offset: offset,
      },
    });

    if (response.data.code !== 1000) {
      throw new Error(data.message || "Đã xảy ra lỗi trong quá trình lấy user");
    }

    return response.data.result; // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};


export {
  getAllTours
};
