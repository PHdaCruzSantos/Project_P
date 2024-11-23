import { Router } from "express";
import {
  getAllItems,
  getItemsInStore,
  getItemId,
  getAllInfoItem,
  getItemHistoricSales,
  getItemPromotions,
  getItemReviews,
  getItemsByCategory,
  getItemAverageRating,
  addItem,
  updateItem,
  deleteItem,
  updatedVariant,
  addCoupons,
  addItemPromotion,
  addCategory,
  addItemCategory,
  addReview,
  addSale,
  addVariantItem,
  filterItems,
  getAllVariantItem,
  getVariantItem,
  getAllCategory,
} from "@/controllers/itemsController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const itemsRouter = Router();

itemsRouter.get("/item", getAllItems);
itemsRouter.get("/item-store/:storeId", getItemsInStore);
itemsRouter.get("/item-search/:itemId", getItemId);
itemsRouter.get("/item-info/:itemId", getAllInfoItem);
itemsRouter.get("/item-sales/:itemId", getItemHistoricSales);
itemsRouter.get("/item-promotions/:itemId", getItemPromotions);
itemsRouter.get("/item-reviews/:itemId", getItemReviews);
itemsRouter.get("/item-category/:category", getItemsByCategory);
itemsRouter.get("/item-rating/:itemId", getItemAverageRating);

itemsRouter.post("/item/filter", filterItems);

itemsRouter.post("/item/create/:storeId", authMiddleware, addItem);
itemsRouter.put("/item/update/:itemId", authMiddleware, updateItem);
itemsRouter.delete("/item/delete/:itemId", authMiddleware, deleteItem);

itemsRouter.get("/item-variant-all/:itemId", getAllVariantItem);
itemsRouter.get("/item-variant/:variantId", getVariantItem);
itemsRouter.post(
  "/item-variant/create/:itemId",
  authMiddleware,
  addVariantItem
);
itemsRouter.put(
  "/item-variant/update/:variantId",
  authMiddleware,
  updatedVariant
);

itemsRouter.post("/coupons", authMiddleware, addCoupons);
itemsRouter.post("/item-promotion/:itemId", authMiddleware, addItemPromotion);

itemsRouter.post("/category/create", authMiddleware, addCategory);
itemsRouter.get("/category", authMiddleware, getAllCategory);
itemsRouter.post("/item-category/:itemId", authMiddleware, addItemCategory);

itemsRouter.post("/item/review/:itemId/:clientId", authMiddleware, addReview);
itemsRouter.post("/item/sale/:clientId/:itemId", authMiddleware, addSale);

export default itemsRouter;
