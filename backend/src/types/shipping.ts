export interface ShippingProduct {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
}

export interface ShippingRequest {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  products: ShippingProduct[];
  options: {
    receipt: boolean;
    own_hand: boolean;
  };
  services: string;
}

export interface ShippingResponse {
  id: number;
  name: string;
  price: number;
  custom_price?: number;
  delivery_time: number;
  delivery_range: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
  };
}
