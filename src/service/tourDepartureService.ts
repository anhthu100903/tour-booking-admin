import axios from "axios";
import { Tour, PriceDetails, TourDepartureRequest, TourDeparture } from "src/sections/tour/type";

interface ApiResponse {
  code: number;
  result: TourDeparture[];
}

interface ApiCreateResponse {
  code: number;
  result: TourDeparture;
}

const API_URL = "http://localhost:8080/tour/tour-departures"; // Thay bằng URL API thực tế

export const getDepartureByTourId = async (id: number): Promise<TourDeparture[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${API_URL}/tour/${id}`);
    if (response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(`API Error: Code ${response.data.code}`);
    }
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};


export const createDeparture = async (token: string, tour: TourDepartureRequest): Promise<TourDeparture> => {
  try {
    const response = await axios.post<ApiCreateResponse>(API_URL,
      tour,
      {
        headers: {
          "Content-Type": "application/json", // Định nghĩa Content-Type là JSON
          Authorization: `Bearer ${token}`, // Thêm header xác thực
        }
      }
    );
    if (response.data.code === 1000) {
      return response.data.result;
    } else {
      throw new Error(`API Error: Code ${response.data.code}`);
    }
  } catch (error) {
    console.error("Error fetching tours:", error);
    throw error;
  }
};
