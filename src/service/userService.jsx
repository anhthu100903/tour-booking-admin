import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tour/users';

  // Hàm để thêm người dùng mới
const createUser = async (userData) => {
    try {
      const response = await axios.post(BASE_URL, userData);
      return response.data; // Trả về dữ liệu nếu thành công
    } catch (error) {
      throw error.response?.data?.message || 'Lỗi khi gọi API'; // Ném lỗi để xử lý ở nơi gọi
    }
};


/**
 * Cập nhật thông tin người dùng (myInfo).
 * @param {string} token - Token xác thực người dùng
 * @param {number} id - ID của người dùng
 * @param {object} userData - Dữ liệu người dùng cần cập nhật
 * @returns {Promise<object>} - Kết quả cập nhật thông tin người dùng
 */
const updateUserInfo = async (token, userData) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
        Authorization: `Bearer ${token}`, // Thêm header xác thực
      },
      body: JSON.stringify(userData), // Chuyển dữ liệu thành chuỗi JSON
    });

    // Kiểm tra xem response có thành công không
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Cập nhật thông tin người dùng thất bại");
    }

    const data = await response.json();

    // Kiểm tra mã code từ response
    if (data.code !== 1000) {
      throw new Error(data.message || "Đã xảy ra lỗi trong quá trình cập nhật thông tin");
    }

    return data.result; // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};



/**
 * Cập nhật thông tin người dùng (myInfo).
 * @param {string} token - Token xác thực người dùng
 * @param {number} id - ID của người dùng
 * @param {object} userData - Dữ liệu người dùng cần cập nhật
 * @returns {Promise<object>} - Kết quả cập nhật thông tin người dùng
 */
const getAllUser = async (limit, offset, token) => {
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
  createUser,
  updateUserInfo,
  getAllUser
};
