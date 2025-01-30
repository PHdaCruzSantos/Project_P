import { db } from "@/index";
import { couponsTable, couponProductsTable } from "@/db/schema";
import { CreateCouponDTO, UpdateCouponDTO } from "../types/coupon";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export class CouponsService {
  async create(data: CreateCouponDTO) {
    const id = uuid();
    const coupon = await db.transaction(async (tx) => {
      const [newCoupon] = await tx
        .insert(couponsTable)
        .values({
          id,
          ...data,
          end_date:
            typeof data.end_date === "string"
              ? new Date(data.end_date)
              : data.end_date,
        })
        .returning();

      if (data.products?.length) {
        await tx.insert(couponProductsTable).values(
          data.products.map((productId) => ({
            id: uuid(),
            coupon_id: id,
            item_id: productId,
          }))
        );
      }

      return newCoupon;
    });

    return coupon;
  }

  async findAll(storeId: string) {
    return await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.store_id, storeId))
      .leftJoin(
        couponProductsTable,
        eq(couponsTable.id, couponProductsTable.coupon_id)
      );
  }

  async findOne(id: string) {
    return await db
      .select()
      .from(couponsTable)
      .where(eq(couponsTable.id, id))
      .leftJoin(
        couponProductsTable,
        eq(couponsTable.id, couponProductsTable.coupon_id)
      )
      .limit(1);
  }

  async update(id: string, data: UpdateCouponDTO) {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(couponsTable)
        .set(data)
        .where(eq(couponsTable.id, id))
        .returning();

      if (data.products) {
        await tx
          .delete(couponProductsTable)
          .where(eq(couponProductsTable.coupon_id, id));

        if (data.products.length) {
          await tx.insert(couponProductsTable).values(
            data.products.map((productId) => ({
              id: uuid(),
              coupon_id: id,
              item_id: productId,
            }))
          );
        }
      }

      return updated;
    });
  }

  async delete(id: string) {
    return await db.transaction(async (tx) => {
      await tx
        .delete(couponProductsTable)
        .where(eq(couponProductsTable.coupon_id, id));

      return await tx.delete(couponsTable).where(eq(couponsTable.id, id));
    });
  }
}
