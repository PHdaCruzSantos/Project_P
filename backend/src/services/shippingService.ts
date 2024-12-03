// src/services/shippingService.ts
import axios from "axios";
import { ShippingRequest, ShippingResponse } from "../types/shipping";

export class ShippingService {
  private readonly apiUrl = process.env.MELHOR_ENVIO_API_URL;
  private readonly apiToken = process.env.MELHOR_ENVIO_TOKEN;

  async calculateShipping(data: ShippingRequest): Promise<ShippingResponse[]> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v2/me/shipment/calculate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Shipping calculation error:", error);
      throw new Error("Failed to calculate shipping");
    }
  }
}
