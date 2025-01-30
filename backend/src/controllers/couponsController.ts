import { Request, Response } from "express";
import { CouponsService } from "../services/couponServices";
import { CreateCouponDTO, UpdateCouponDTO } from "../types/coupon";

export class CouponsController {
  private couponsService: CouponsService;

  constructor() {
    this.couponsService = new CouponsService();
  }

  async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      const coupon = await this.couponsService.create(
        req.body as CreateCouponDTO
      );
      res
        .status(201)
        .json({ message: "Coupon created successfully", data: coupon });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const storeId = req.params.storeId;
      const coupons = await this.couponsService.findAll(storeId);
      res.status(200).json(coupons);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const coupon = await this.couponsService.findOne(req.params.id);
      if (!coupon) {
        res.status(404).json({ message: "Coupon not found" });
      }
      res.status(200).json(coupon);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await this.couponsService.update(
        req.params.id,
        req.body as UpdateCouponDTO
      );
      if (!updated) {
        res.status(404).json({ message: "Coupon not updated" });
      }
      res.status(200).json({ message: "Coupon updated successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await this.couponsService.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Coupon not deleted" });
      }
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
