import storesServices from "@/services/storeService";
import { Request, Response } from "express";

export const getStores = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const stores = await storesServices.getStores(userId);

    res.status(200).json(stores);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getStore = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const store = await storesServices.getStore(storeId);

    if (!store) {
      throw new Error("Store not found");
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const addStore = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const store = req.body;
    const newStore = await storesServices.addStore(userId, store);

    if (!newStore) {
      throw new Error("Store not created");
    }

    res.status(201).json({ mensagem: "Store created successfully" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId; //NOTE - Better use req.path.split("/")[3] instead of req.params.storeId
    const store = req.body;
    const updatedStore = await storesServices.updateStore(storeId, store);
    if (!updatedStore) {
      throw new Error("Store not found");
    }

    res.status(200).json({ message: "Store updated successfully" });
  } catch (error) {
    res.status(404).json({ message: "Controller", error });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const deletedStore = await storesServices.deleteStore(storeId);
    if (!deletedStore) {
      throw new Error("Store not found");
    }

    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const desativeStore = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const desativeStore = await storesServices.desativeStore(storeId);

    res.status(200).json(desativeStore);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
