import { Request, Response } from "express";
import { NFEService } from "../services/NFeService";

export class NFEController {
  private nfeService: NFEService;

  constructor() {
    this.nfeService = new NFEService();
  }

  async emitNFE(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const nfe = await this.nfeService.emitNFE(orderId);
      res.status(201).json({
        message: "NFE emitted successfully",
        data: nfe,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getNFEStatus(req: Request, res: Response) {
    try {
      const { nfeId } = req.params;
      const status = await this.nfeService.getNFEStatus(nfeId);
      res.status(200).json({
        data: status,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
