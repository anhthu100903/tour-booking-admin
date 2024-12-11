export interface PaymentProps {
  id: number;
  paymentName: string;
  amount: number;
  createdAt: string; // Dạng chuỗi ISO
  bookTourId: number;
  active: boolean;
}

export interface BookingProps {
  id: number;
  numberOfAdult: number;
  numberOfChildren: number;
  numberOfBaby: number;
  departureDate: string; // Dạng chuỗi ISO
  createdAt: string; // Dạng chuỗi ISO
  active: boolean;
  tourId: number;
  tourName: string;
  destinitation: string;
  userId: number;
  fullName: string;
  email: string;
  payment: PaymentProps;
}

export interface AllPaymentResponse {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  bookTour: BookingProps[];
}
