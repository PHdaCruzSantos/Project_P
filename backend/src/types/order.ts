export interface CreateOrderDTO {
  clients_id: string;
  payment_id: string;
  status: "pending" | "CANCELLED" | "FAILED" | "CONFIRMED" | "RECEIVED";
  total_amount: number;
  payment_method: string;
  shipping_address: string;
  created_at: Date;
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

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface StoreOrderMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalItems: number;
  statusBreakdown: {
    [key: string]: number;
  };
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
