import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setToken, getToken } from './localStorage';

// Mở rộng AxiosRequestConfig để thêm thuộc tính `_retry`
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;  // Thêm thuộc tính _retry kiểu boolean (optional)
}

// Tạo một instance của axios
const api = axios.create({
  baseURL: 'http://localhost:8080/tour', // Thay đổi thành URL của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Định nghĩa kiểu dữ liệu trả về từ API cho việc refresh token
interface RefreshTokenResponse {
  token: string;
}

// Hàm làm mới token
const refreshToken = async (): Promise<string | null> => {
  const currentToken = localStorage.getItem("accessToken"); // Lấy token hiện tại
  if (!currentToken) return null;

  try {
    const response = await axios.post<RefreshTokenResponse>('http://localhost:8080/tour/auth/refresh', null, {
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    const newToken = response.data.token;
    localStorage.setItem("accessToken", newToken); // Lưu token mới vào localStorage
    return newToken;
  } catch (error) {
    console.error('Không thể làm mới token', error);
    // Xử lý lỗi nếu không thể refresh token, có thể xóa token hoặc chuyển hướng người dùng
    localStorage.removeItem('accessToken'); // Xóa token cũ nếu không thể refresh
    return null;
  }
};

api.interceptors.response.use(
  (response) => {
    // Kiểm tra nếu response code là lỗi nhưng status là 200
    if (response.data?.code === 1006) {
      console.log("Detected authentication error");
      // Có thể tự chuyển response thành lỗi để interceptor xử lý
      return Promise.reject({
        response: {
          status: 401,
          data: response.data
        }
      });
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi như bình thường
    console.log("Error Interceptor Triggered:", error.response?.status);
    return Promise.reject(error);
  }
);

// Interceptor cho phản hồi API để xử lý lỗi 401 và tự động làm mới token
api.interceptors.response.use(
  (response: AxiosResponse) => response,  // Nếu thành công, trả về phản hồi
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig; // Ép kiểu về CustomAxiosRequestConfig

    console.log("refresh token");
    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("refresh token");
      
      // Làm mới token
      const newToken = await refreshToken();
      if (newToken) {
        // Kiểm tra nếu headers tồn tại trước khi sử dụng
        if (originalRequest.headers) {
          // Nếu lấy được token mới, cập nhật lại header và thực hiện lại request
          axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          setToken(newToken);  // Lưu token mới vào localStorage hoặc state
          return api(originalRequest);  // Thực hiện lại yêu cầu ban đầu với token mới
        } else {
          return Promise.reject('Headers không tồn tại');
        }
      } else {
        // Nếu không thể lấy token mới, có thể redirect đến trang login hoặc làm gì đó
        console.log('Token đã hết hạn và không thể làm mới');
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:3000/'; 
        return Promise.reject(error);  // Hoặc xử lý lỗi theo cách bạn muốn
      }
    }

    console.log("refresh token");
    return Promise.reject(error);  // Trả về lỗi nếu không phải là lỗi 401
  }
);

export default api;
