import axios from 'axios';

// Định nghĩa kiểu dữ liệu trả về từ API
type UserResponse = {
  code: number;
  message: string;
  result: any; // Có thể thay 'any' bằng một kiểu cụ thể nếu bạn biết cấu trúc của dữ liệu trả về
};

// Base URL cho API
const BASE_URL = 'http://localhost:8080/tour/users';

/**
 * Hàm để thêm người dùng mới
 * @param {object} userData - Dữ liệu người dùng cần thêm
 * @param {string} token - Token xác thực người dùng
 * @returns {Promise<object>} - Dữ liệu người dùng sau khi thêm
 */
const createUser = async (userData: object, token: string): Promise<object> => {
  try {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
    };

    // Nếu có token, thêm Authorization header
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(BASE_URL, userData, { headers });

    return response.data; // Trả về dữ liệu người dùng vừa tạo
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error.response?.data?.message || "Lỗi khi tạo người dùng"; // Trả về thông báo lỗi
  }
};

/**
 * Cập nhật thông tin người dùng.
 * @param {string} token - Token xác thực người dùng
 * @param {number} username - ID của người dùng
 * @param {object} userData - Dữ liệu người dùng cần cập nhật
 * @returns {Promise<object>} - Kết quả cập nhật thông tin người dùng
 */
const updateUser = async (token: string, userData: object, username: string): Promise<object> => {
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
  } catch (error: any) {
    console.error("Error updating user info:", error);
    throw error; // Ném lỗi để phía trên xử lý
  }
};

/**
 * Lấy tất cả người dùng với phân trang.
 * @param {number} limit - Số lượng người dùng mỗi lần lấy
 * @param {number} offset - Vị trí bắt đầu của dữ liệu người dùng
 * @param {string} token - Token xác thực người dùng
 * @returns {Promise<UserResponse>} - Dữ liệu người dùng
 */
const getAllUser = async (limit: number, offset: number, token: string): Promise<UserResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/pagination`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
        offset: offset,
      },
    });

    const result = response.data.result;

    // Kiểm tra cấu trúc và ép kiểu khi chắc chắn
    if (
      typeof result.totalPages !== 'number' ||
      typeof result.currentPage !== 'number' ||
      typeof result.totalElements !== 'number' ||
      !Array.isArray(result.users)
    ) {
      throw new Error("Dữ liệu trả về không đúng cấu trúc.");
    }

    return result as UserResponse; // Trả về đúng kiểu UserResponse
  } catch (error: any) {
    console.error("Error getting users:", error);
    throw error;
  }
};


/**
 * Lấy tất cả người dùng với phân trang.
 * @param {number} limit - Số lượng người dùng mỗi lần lấy
 * @param {number} offset - Vị trí bắt đầu của dữ liệu người dùng
 * @param {string} token - Token xác thực người dùng
 * @returns {Promise<UserResponse>} - Dữ liệu người dùng
 */
const getUserByUsername = async (username: string, token: string): Promise<Object> => {
  try {
    const response = await axios.get(`${BASE_URL}/username/${username}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data.result;
  } catch (error: any) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export {
  createUser,
  updateUser,
  getAllUser,
  getUserByUsername
};
