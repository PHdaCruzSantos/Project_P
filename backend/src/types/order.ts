export interface CreateOrderDTO {
  clients_id: string;
  payment_id: string;
  status: "pending" | "paid" | "cancelled" | "delivered";
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  shipping_price: number;
  items: Array<{
    item_id: string;
    quantity: number;
    price: number;
    item_name: string;
  }>;
}

export interface OrderResponse {
  id: string;
  clients_id: string;
  payment_id: string;
  status: string;
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  shipping_price: number;
  created_at: Date;
  items: Array<{
    id: string;
    item_id: string;
    quantity: number;
    price: number;
    item_name: string;
  }>;
}
