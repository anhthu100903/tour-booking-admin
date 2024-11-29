import axios from 'axios';

const BASE_URL = 'http://localhost:8080/tour/users';

 /**
 * Hàm để thêm người dùng mới
 * @param {object} userData - Dữ liệu người dùng cần thêm
 * @param {string} token - Token xác thực người dùng
 * @returns {Promise<object>} - Dữ liệu người dùng sau khi thêm
 */
const createUser = async (userData, token) => {
  try {
    const headers = {
      "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
    };

    // Nếu có token, thêm Authorization header
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(BASE_URL, userData, { headers });

    return response.data; // Trả về dữ liệu người dùng vừa tạo
  } catch (error) {
    console.error("Error creating user:", error);
    throw error.response?.data?.message || "Lỗi khi tạo người dùng"; // Trả về thông báo lỗi
  }
};


/**
 * Cập nhật thông tin người dùng.
 * @param {string} token - Token xác thực người dùng
 * @param {number} id - ID của người dùng
 * @param {object} userData - Dữ liệu người dùng cần cập nhật
 * @returns {Promise<object>} - Kết quả cập nhật thông tin người dùng
 */
const updateUser = async (token, userData, username) => {
  try {
    const response = await fetch(`${BASE_URL}/${username}`, {
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
  updateUser,
  getAllUser
};
