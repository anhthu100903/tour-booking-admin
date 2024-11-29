import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tour/types';

/**
 * Cập nhật thông tin (myInfo).
 * @param {string} token - Token xác thực
 * @returns {Promise<object>} - Kết quả cập nhật thông tin
 */
const getAllTourTypes = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
        Authorization: `Bearer ${token}`, // Thêm header xác thực
      },
    });

    console.log(response);

    return response.data; // Trả về thông tin tour types
  } catch (error) {
    console.error("Error get tour type info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};


export {
  getAllTourTypes
};
