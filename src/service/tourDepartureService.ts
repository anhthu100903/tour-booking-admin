import axios from "axios";

interface PriceDetails {
  id: number;
  adultPrice: number;
  childrenPrice: number;
  babyPrice: number;
  extraFee: number;
  active: boolean;
}

interface TourDeparture {
  id: number;
  departureDate: string;
  quantity: number;
  available: number;
  active: boolean;
  priceDetails: PriceDetails;
}

interface ApiResponse {
  code: number;
  result: TourDeparture[];
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
