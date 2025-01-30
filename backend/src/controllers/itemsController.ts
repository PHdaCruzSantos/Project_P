import itemsService from "@/services/itemsService";
import { Request, Response } from "express";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await itemsService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getItemsInStore = async (req: Request, res: Response) => {
  try {
    const storeId = req.params.storeId;
    const items = await itemsService.getItemsInStore(storeId);
    if (!items) {
      res.status(404).json({ message: "Store not found" });
    }
    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getItemId = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const itemSearch = await itemsService.getItemId(itemId);
    if (!itemSearch) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(itemSearch);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllInfoItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const itemInfo = await itemsService.getAllInfoItem(itemId);
    res.status(200).json(itemInfo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// export const getItemPromotions = async (req: Request, res: Response) => {
//   try {
//     const { itemId } = req.params;
//     const promotions = await itemsService.getItemPromotions(itemId);
//     res.status(200).json(promotions);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const getItemReviews = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const reviews = await itemsService.getItemReviews(itemId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getItemAverageRating = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const averageRating = await itemsService.getItemAverageRating(itemId);
    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getItemsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const items = await itemsService.getItemsByCategory(category);
    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getItemHistoricSales = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const sales = await itemsService.getItemHistoricSales(itemId);
    res.status(200).json(sales);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    const store_id = req.params.storeId;
    await itemsService.addItem(itemData, store_id);
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const itemData = req.body;
    const updateItem = await itemsService.updateItem(itemId, itemData);
    if (!updateItem) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    await itemsService.deleteItem(itemId);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addVariantItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const stockData = req.body;
    await itemsService.addVariantItem(itemId, stockData);
    res.status(201).json({ message: "Item stock added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatedVariant = async (req: Request, res: Response) => {
  try {
    const variantId = req.params.variantId;
    const stockData = req.body;
    const updateVatirant = await itemsService.updatedVariant(
      variantId,
      stockData
    );
    if (!updateVatirant) {
      res.status(404).json({ message: "Variant not found" });
    }
    res.status(200).json({ message: "Variant item updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addCoupons = async (req: Request, res: Response) => {
  try {
    const couponData = req.body;
    await itemsService.addCoupons(couponData);
    res.status(201).json({ message: "Coupon added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addItemPromotion = async (req: Request, res: Response) => {
  try {
    const itemId = req.body.itemId;
    const promotionName = req.body;
    await itemsService.addItemPromotion(itemId, promotionName);
    res.status(201).json({ message: "Item promotion added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    await itemsService.addCategory(categoryData);
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addItemCategory = async (req: Request, res: Response) => {
  try {
    const itemId = req.body.itemId;
    const categoryName = req.body;
    await itemsService.addItemCategory(itemId, categoryName);
    res.status(201).json({ message: "Item category added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const clientId = req.params.clientId;
    const reviewData = req.body;
    const newReview = await itemsService.addReview(
      itemId,
      clientId,
      reviewData
    );
    if (!newReview) {
      res.status(404).json({ message: "Item not found" });
    }
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addSale = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const itemId = req.params.itemId;
    const saleData = req.body;
    const newSale = await itemsService.addSale(clientId, itemId, saleData);
    if (!newSale) {
      res.status(404).json({ message: "Internal error" });
    }
    res.status(201).json({ message: "Sale added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const filterItems = async (req: Request, res: Response) => {
  try {
    // Obter os filtros do corpo da requisição
    const filters = req.body;

    // Chamar o serviço para aplicar os filtros
    const items = await itemsService.filterItems(filters);
    // Retornar os itens filtrados
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllVariantItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;
    const variant = await itemsService.getAllVariantItem(itemId);
    if (!variant) {
      //FIXME - deferenciar um retorno vazio de um retorno com erro, o retorno vazia tambem é um retorno valido.
      res.status(404).json({ message: "Item not found or not Variants" });
    }
    res.status(200).json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVariantItem = async (req: Request, res: Response) => {
  try {
    const variantId = req.params.variantId;
    const variant = await itemsService.getVariantItem(variantId);
    if (!variant) {
      res.status(404).json({ message: "Variant not found" });
    }
    res.status(200).json(variant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await itemsService.getAllCategory();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
