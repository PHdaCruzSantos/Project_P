export interface ICoupon {
  id?: string;
  code: string;
  name?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  start_date?: string | Date;
  end_date: string | Date;
  store_id: string;
  status: "active" | "inactive";
  products?: string[];
}

export type CreateCouponDTO = Omit<ICoupon, "id">;
export type UpdateCouponDTO = Partial<CreateCouponDTO>;
