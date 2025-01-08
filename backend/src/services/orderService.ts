import { db } from "@/index";
import { ordersTable, orderItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { CreateOrderDTO, OrderResponse } from "@/types/order";

const createOrder = async (
  orderData: CreateOrderDTO
): Promise<OrderResponse> => {
  const orderId = uuidv4();

  await db.transaction(async (tx) => {
    // Create order
    await tx.insert(ordersTable).values({
      id: orderId,
      ...orderData,
    });

    // Create order items
    await tx.insert(orderItemsTable).values(
      orderData.items.map((item) => ({
        id: uuidv4(),
        order_id: orderId,
        ...item,
      }))
    );
  });

  return getOrderById(orderId);
};

const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const order = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId))
    .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
    .execute();

  if (!order || order.length === 0) throw new Error("Order not found");

  // Transform the result into OrderResponse format
  const orderData = order[0].orders;
  const items = order.map((row) => ({
    id: row.order_items.id,
    item_id: row.order_items.item_id,
    quantity: row.order_items.quantity,
    price: row.order_items.price,
    item_name: row.order_items.item_name,
  }));

  return {
    ...orderData,
    items,
  };
};

const getClientOrders = async (clientId: string): Promise<OrderResponse[]> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.clients_id, clientId))
    .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
    .orderBy(ordersTable.created_at)
    .execute();

  const returnOrders = orders.reduce((acc, order) => {
    const existingOrder = acc.find((o) => o.id === order.orders.id);
    const item = {
      id: order.order_items.id,
      item_id: order.order_items.item_id,
      quantity: order.order_items.quantity,
      price: order.order_items.price,
      item_name: order.order_items.item_name,
    };

    if (existingOrder) {
      existingOrder.items.push(item);
    } else {
      acc.push({
        ...order.orders,
        items: [item],
      });
    }

    return acc;
  }, []);

  return returnOrders;
};

const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<OrderResponse> => {
  await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, orderId));

  return getOrderById(orderId);
};

export default {
  createOrder,
  getOrderById,
  getClientOrders,
  updateOrderStatus,
};
