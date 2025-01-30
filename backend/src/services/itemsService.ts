import { db } from "../index";
import {
  itemsTable,
  reviewsTable,
  couponsTable,
  variantItemTable,
  categoriesTable,
  salesTable,
  itemColorsTable,
  gradeSizesTable,
} from "@/db/schema";
import { eq, avg, gt, lt, and, sql, desc } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const getAllItems = async () => {
  return await db.select().from(itemsTable);
};

const getItemsInStore = async (storeId: string) => {
  const items = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.store_id, storeId));

  if (!items) {
    throw new Error("No items in Store");
  }

  return items;
};

const getItemId = async (itemId: string) => {
  const item = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.id, itemId));

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

const getCardItems = async () => {
  const items = await db
    .select({
      name: itemsTable.name,
      description: itemsTable.description,
      image_names: itemsTable.image_names,
      price: itemsTable.price,
      type: itemsTable.type,
    })
    .from(itemsTable)
    .where(eq(itemsTable.status, "available"));

  return items;
};

// Função para obter todas as informações de um item
const getAllInfoItem = async (itemId: string) => {
  const item = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.id, itemId))
    .get();

  if (!item) {
    throw new Error("Item not found");
  }

  const stock = await db
    .select()
    .from(variantItemTable)
    .where(eq(variantItemTable.item_id, itemId));

  // const discounts = await db
  //   .select()
  //   .from(couponsTable)
  //   .where(eq(couponsTable.item_id, itemId));

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.item_id, itemId));

  const averageRating = await db
    .select({ averageRating: avg(reviewsTable.rating) })
    .from(reviewsTable)
    .where(eq(reviewsTable.item_id, itemId))
    .get();

  return {
    item,
    stock,
    // discounts,
    reviews,
    averageRating: averageRating ? averageRating.averageRating : null,
  };
};

// Função para obter todas as promoções de um item
// const getItemPromotions = async (itemId: string) => {
//   const promotions = await db
//     .select()
//     .from(couponsTable)
//     .where(eq(couponsTable.item_id, itemId));

//   return promotions;
// };

// Função para obter todas as avaliações de um item
const getItemReviews = async (itemId: string) => {
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.item_id, itemId));

  return reviews;
};

// Função para obter a média da nota de avaliação de um item
const getItemAverageRating = async (itemId: string) => {
  const averageRating = await db
    .select({ averageRating: avg(reviewsTable.rating) })
    .from(reviewsTable)
    .where(eq(reviewsTable.item_id, itemId))
    .get();

  return averageRating ? averageRating.averageRating : null;
};

// Função para obeter todos os itens de uma categoria
const getItemsByCategory = async (category: string) => {
  const categoriaId = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.name, category))
    .get();

  const items = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, categoriaId.id));

  return items;
};

// Função para obert historico de vendas do item
const getItemHistoricSales = async (itemId: string) => {
  const sales = await db
    .select()
    .from(salesTable)
    .where(eq(salesTable.item_id, itemId));

  return sales;
};
// Funão para adicionar um novo item
interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  store_id: string;
  image_names: string;
  status: string;
  deleted_at: Date;
  created_at: Date;
}
const addItem = async (item: Item, stored_id: string) => {
  const newItem = {
    id: uuid(),
    name: item.name,
    description: item.description,
    price: item.price,
    type: item.type,
    store_id: stored_id,
    image_names: item.image_names,
    status: "active",
    deleted_at: null,
    created_at: new Date(),
  };

  const retItem = await db.insert(itemsTable).values(newItem).execute();

  return retItem;
};
const updateItem = async (item_id: string, item: Item) => {
  const retItem = await db
    .update(itemsTable)
    .set(item)
    .where(eq(itemsTable.id, item_id));
  return retItem.rowsAffected;
};

const deleteItem = async (itemId: string) => {
  const verifyItem = await db
    .select()
    .from(itemsTable)
    .where(eq(itemsTable.id, itemId))
    .get();

  verifyItem.deleted_at = new Date();
  verifyItem.status = "inactive";
  const retItem = await db
    .update(itemsTable)
    .set(verifyItem)
    .where(eq(itemsTable.id, itemId));

  return retItem.rowsAffected;
};

interface VariantItem {
  id: string;
  item_id: string;
  variant_name: string;
  size_id?: string;
  color_id?: string;
  quantity: number;
  price: number;
}

// funcao para pegar todas as variantes de um item
const getAllVariantItem = async (itemId: string) => {
  const variant = await db
    .select()
    .from(variantItemTable)
    .where(eq(variantItemTable.item_id, itemId))
    .all();

  return variant;
};

// funcao para pegar uma varainte especifica de um item
const getVariantItem = async (variantId: string) => {
  const variant = await db
    .select()
    .from(variantItemTable)
    .where(eq(variantItemTable.id, variantId))
    .get();

  return variant;
};

const addVariantItem = async (item_id: string, variant: VariantItem) => {
  const verifyItem = await db
    .select({
      id: itemsTable.id,
    })
    .from(itemsTable)
    .where(eq(itemsTable.id, item_id))
    .get();

  if (!verifyItem) {
    throw new Error("Item not found");
  }
  const newVariant = {
    id: uuid(),
    item_id: item_id,
    variant_name: variant.variant_name,
    size_id: variant.size_id,
    color_id: variant.color_id,
    quantity: variant.quantity,
    price: variant.price,
  };

  const retVariant = await db
    .insert(variantItemTable)
    .values(newVariant)
    .execute();

  return retVariant;
};

const updatedVariant = async (variantId: string, variant: VariantItem) => {
  const retVariant = await db
    .update(variantItemTable)
    .set(variant)
    .where(eq(variantItemTable.id, variantId));

  return retVariant.rowsAffected;
};

interface Coupons {
  id: string;
  name: string;
  item_id: string;
  discount_percentage: number;
  description: string;
  stored_id: string;
  code: string;
  start_date: Date;
  end_date: Date;
}
const addCoupons = async (coupons: Coupons) => {
  const verifyItem = await db
    .select({
      id: itemsTable.id,
      stored_id: itemsTable.store_id,
    })
    .from(itemsTable)
    .where(eq(itemsTable.id, coupons.item_id))
    .get();

  if (!verifyItem) {
    throw new Error("Item not found");
  }

  const newCoupon = {
    id: uuid(),
    item_id: verifyItem.id,
    name: coupons.name,
    discount_percentage: coupons.discount_percentage,
    description: coupons.description,
    store_id: verifyItem.stored_id,
    code: `${coupons.name.slice(0, 3)}${coupons.item_id.slice(0, 3)}${
      coupons.discount_percentage
    }`,
    start_date: coupons.start_date,
    end_date: coupons.end_date,
  };

  const retCupon = await db
    .insert(couponsTable)
    .values({ ...newCoupon })
    .execute();

  return retCupon;
};

//  ANCHOR - Função para adicionar uma promoção a um item passando o item e o nome da promocao selecionada
//  REVIEW - O que é uma promoção?
//  NOTE - A promoção é um desconto que pode ser aplicado a um item os cupons sao pre criados e ele selciona qual cupon ele quer aplicar

const addItemPromotion = async (itemId: string, promotionName: string) => {
  const verifyPromotion = await db
    .select()
    .from(couponsTable)
    .where(eq(couponsTable.name, promotionName))
    .get();

  if (!verifyPromotion) {
    throw new Error("Promotion not found");
  }

  return await db
    .insert(couponsTable)
    .values({ item_id: itemId, ...verifyPromotion });
};

interface Category {
  id: string;
  name: string;
  item_id?: string;
  description: string;
}
//get item da categoria
const getCategoryItem = async (itemId: string) => {
  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.item_id, itemId));

  return category;
};

const getAllCategory = async () => {
  const retCategory = await db.select().from(categoriesTable);

  return retCategory;
};

const addCategory = async (category: Category) => {
  return await db.insert(categoriesTable).values(category).execute();
};

const addItemCategory = async (itemId: string, categoryName: string) => {
  const verifyItem = await db
    .select({
      id: itemsTable.id,
    })
    .from(itemsTable)
    .where(eq(itemsTable.id, itemId))
    .get();

  if (!verifyItem) {
    throw new Error("Item not found");
  }

  const verifyCategory = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.name, categoryName))
    .get();

  if (!verifyCategory) {
    throw new Error("Category not found");
  }

  return await db
    .insert(categoriesTable)
    .values({ item_id: itemId, ...verifyCategory });
};

interface Review {
  id: string;
  clients_id: string;
  item_id: string;
  rating: number;
  comment: string;
  created_at: Date;
}

const addReview = async (
  item_id: string,
  client_id: string,
  review: Review
) => {
  const newReview = {
    id: uuid(),
    clients_id: client_id,
    item_id: item_id,
    rating: review.rating,
    comment: review.comment,
    created_at: new Date(),
  };

  const retRevew = await db.insert(reviewsTable).values(newReview);

  return retRevew;
};

interface Sale {
  id: string;
  clients_id: string;
  item_id: string;
  variant_id?: string;
  payment_method: string;
  quantity: number;
  total_price: number;
  created_at: Date;
}

const addSale = async (clients_id: string, item_id: string, sale: Sale) => {
  const newSale = {
    id: uuid(),
    clients_id: clients_id,
    item_id: item_id,
    quantity: sale.quantity,
    total_price: sale.total_price,
    variant_id: sale.variant_id,
    payment_method: sale.payment_method,
    created_at: new Date(),
  };

  const retSale = await db.insert(salesTable).values(newSale).execute();

  return retSale;
};

//SECTION - Aplicar filyto composto para filtrar os itens por categoria, preço, avaliação, promoção, etc

interface Filter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  promotion?: string;
  color?: string;
  size?: string;
  sortBy?: "price" | "rating";
  limit?: number;
}

const filterItems = async (filter: Filter) => {
  const conditions = [];

  // Filtros dinâmicos
  if (filter.category) {
    conditions.push(eq(categoriesTable.name, filter.category));
  }

  if (filter.minPrice !== undefined) {
    conditions.push(gt(itemsTable.price, filter.minPrice));
  }

  if (filter.maxPrice !== undefined) {
    conditions.push(lt(itemsTable.price, filter.maxPrice));
  }

  if (filter.minRating !== undefined) {
    conditions.push(gt(reviewsTable.rating, filter.minRating));
  }

  if (filter.maxRating !== undefined) {
    conditions.push(lt(reviewsTable.rating, filter.maxRating));
  }

  if (filter.promotion) {
    conditions.push(eq(couponsTable.name, filter.promotion));
  }

  if (filter.color) {
    conditions.push(eq(itemColorsTable.color, filter.color));
  }

  if (filter.size) {
    conditions.push(eq(gradeSizesTable.size, filter.size));
  }

  if (filter.sortBy === undefined) {
    filter.sortBy = "price";
  }

  if (filter.limit === undefined) {
    filter.limit = 10;
  }

  // Construção da consulta
  const query = db
    .select({
      id: itemsTable.id,
      name: itemsTable.name,
      description: itemsTable.description,
      price: itemsTable.price,
      category: categoriesTable.name,
      color: itemColorsTable.color,
      size: gradeSizesTable.size,
      rating: avg(reviewsTable.rating),
    })
    .from(itemsTable)
    .leftJoin(categoriesTable, eq(itemsTable.category_id, categoriesTable.id))
    .leftJoin(reviewsTable, eq(itemsTable.id, reviewsTable.item_id))
    .leftJoin(couponsTable, eq(itemsTable.id, couponsTable.item_id))
    .leftJoin(itemColorsTable, eq(itemsTable.id, itemColorsTable.item_id))
    .leftJoin(gradeSizesTable, eq(itemsTable.id, gradeSizesTable.id))
    .where(
      conditions.length
        ? conditions.reduce((a, b) => and(a, b), conditions[0])
        : undefined
    )
    .orderBy(
      filter.sortBy === "price" ? itemsTable.price : reviewsTable.rating, // Ordenação padrão por avaliação
      desc(filter.sortBy === "price" ? itemsTable.price : reviewsTable.rating) // Ordem decrescente por padrão
    )
    .limit(filter.limit || 10)
    .groupBy(itemsTable.name);

  const items = await query.all();
  console.log("items", items);

  return items;
};

export default {
  getAllItems,
  getItemsInStore,
  getItemId,
  getAllInfoItem,
  getCardItems,
  // getItemPromotions,
  getItemReviews,
  getItemAverageRating,
  getItemsByCategory,
  getItemHistoricSales,
  addItem,
  updateItem,
  deleteItem,
  addVariantItem,
  updatedVariant,
  addCoupons,
  addItemPromotion,
  addCategory,
  addItemCategory,
  addReview,
  addSale,
  filterItems,
  getVariantItem,
  getAllVariantItem,
  getAllCategory,
};
