export type Tour = {
  id: number;
  name: string;
  description: string;
  destinationLocation: string;
  departureLocation: string;
  numberOfDays: string;
  tourTypeDTO: TypeDTO | null;
  images?: string;
};

export type TypeDTO = {
  id: number;
  name: string;
  active: boolean;
}

export type Result = {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  tours: Tour[];
}


export type TourCreate = {
  id: number | string;
  name: string;
  description: string;
  destinationLocation: string;
  departureLocation: string;
  numberOfDays: string;
  tourTypeDTO: TypeDTO | null;
  images: string;
  quantity: number;
  departureDate: string;
  adultPrice: number;
  childrenPrice: number;
  babyPrice: number;
  extraFee: number;
};

export type tourRequest = {
  name: string;
  description: string;
  destinationLocation: string;
  departureLocation: string;
  numberOfDays: string;
  tourTypeId: number;
  images: string;
  active: boolean
};

export type PriceDetails = {
  id: number;
  adultPrice: number;
  childrenPrice: number;
  babyPrice: number;
  extraFee: number;
  active: boolean;
}

export type TourDeparture = {
  id: number;
  departureDate: string;
  quantity: number;
  available: number;
  active: boolean;
  priceDetail: PriceDetails;
}

export type PriceDetailRequest = {
  adultPrice: number;
  childrenPrice: number;
  babyPrice: number;
  extraFee: number;
  active: boolean;
}

export type TourDepartureRequest = {
  departureDate: string;
  quantity: number;
  available: number;
  active: boolean;
  tourID: number;
  priceDetail: PriceDetailRequest;
}