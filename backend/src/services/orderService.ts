import { db } from "@/index";
import {
  ordersTable,
  orderItemsTable,
  itemsTable,
  clientsTable,
  clientAddressesTable,
} from "@/db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  CreateOrderDTO,
  OrderResponse,
  OrderFilters,
  PaginatedResponse,
  StoreOrderMetrics,
} from "@/types/order";

const createOrder = async (
  orderData: CreateOrderDTO
): Promise<OrderResponse> => {
  const orderId = uuidv4();

  await db.transaction(async (tx) => {
    // Create order
    await tx.insert(ordersTable).values({
      id: orderId,
      created_at: new Date(),
      updated_at: new Date(),
      ...orderData,
    });

    // Create order items
    await tx.insert(orderItemsTable).values(
      orderData.items.map((item) => ({
        id: uuidv4(),
        order_id: orderId,
        created_at: new Date(),
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
const getStoreOrders = async (
  storeId: string,
  filters: OrderFilters
): Promise<PaginatedResponse<OrderResponse>> => {
  const { startDate, endDate, status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  // Aplicar filtros
  const conditions = [
    startDate && gte(ordersTable.created_at, new Date(startDate)),
    endDate && lte(ordersTable.created_at, new Date(endDate)),
    status && eq(ordersTable.status, status),
  ].filter(Boolean);

  // Construir query base
  let query = db
    .select({
      order: ordersTable,
      items: orderItemsTable,
      storeItem: itemsTable,
      client: clientsTable,
      clientAddress: clientAddressesTable,
    })
    .from(ordersTable)
    .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
    .innerJoin(
      itemsTable,
      and(
        eq(orderItemsTable.item_id, itemsTable.id),
        eq(itemsTable.store_id, storeId)
      )
    )
    .leftJoin(clientsTable, eq(ordersTable.clients_id, clientsTable.id))
    .leftJoin(
      clientAddressesTable,
      eq(clientsTable.id, clientAddressesTable.clients_id)
    )
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // Executar query para contar total
  const countQuery = await db
    .select({
      count: sql`count(DISTINCT ${ordersTable.id})`,
    })
    .from(query.as("derived"));
  const totalItems = Number(countQuery[0].count);

  // Aplicar paginação
  const paginatedQuery = query
    .orderBy(desc(ordersTable.created_at))
    .limit(limit)
    .offset(offset);

  const orders = await paginatedQuery;

  // Agrupar e formatar resultados
  const groupedOrders = orders.reduce((acc, curr) => {
    const existingOrder = acc.find((o) => o.id === curr.order.id);

    const orderItem = {
      id: curr.items.id,
      item_id: curr.items.item_id,
      quantity: curr.items.quantity,
      price: curr.items.price,
      item_name: curr.items.item_name,
    };

    const clientInfo = {
      id: curr.client.id,
      name: curr.client.name,
      email: curr.client.email,
      address: {
        cep: curr.clientAddress?.cep,
        address: curr.clientAddress?.address,
        city: curr.clientAddress?.city,
        state: curr.clientAddress?.state,
        country: curr.clientAddress?.country,
      },
    };

    if (existingOrder) {
      existingOrder.items.push(orderItem);
    } else {
      acc.push({
        id: curr.order.id,
        clients_id: curr.order.clients_id,
        payment_id: curr.order.payment_id,
        status: curr.order.status,
        total_amount: curr.order.total_amount,
        payment_method: curr.order.payment_method,
        shipping_address: curr.order.shipping_address,
        shipping_price: curr.order.shipping_price,
        tracking_code: curr.order.tracking_code,
        notes: curr.order.notes,
        created_at: curr.order.created_at,
        updated_at: curr.order.updated_at,
        items: [orderItem],
        client: clientInfo,
      });
    }

    return acc;
  }, []);

  return {
    data: groupedOrders,
    total: totalItems,
    page,
    totalPages: Math.ceil(totalItems / limit),
    hasMore: page * limit < totalItems,
  };
};

const getStoreMetrics = async (
  storeId: string,
  dateRange: { startDate?: string; endDate?: string }
): Promise<StoreOrderMetrics> => {
  const { startDate, endDate } = dateRange;

  // Query base para todos os pedidos da loja no período
  const conditions = [
    startDate && gte(ordersTable.created_at, new Date(startDate)),
    endDate && lte(ordersTable.created_at, new Date(endDate)),
  ].filter(Boolean);

  const query = db
    .select({
      order: ordersTable,
      items: orderItemsTable,
      storeItem: itemsTable,
    })
    .from(ordersTable)
    .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.order_id))
    .innerJoin(
      itemsTable,
      and(
        eq(orderItemsTable.item_id, itemsTable.id),
        eq(itemsTable.store_id, storeId)
      )
    )
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const orders = await query;

  // Calcular métricas
  const metrics: StoreOrderMetrics = {
    totalOrders: new Set(orders.map((o) => o.order.id)).size,
    totalRevenue: orders.reduce(
      (sum, order) => sum + order.items.price * order.items.quantity,
      0
    ),
    totalItems: orders.reduce((sum, order) => sum + order.items.quantity, 0),
    statusBreakdown: {},
    revenueByDay: [],
  };

  // Calcular breakdown por status
  orders.forEach((order) => {
    metrics.statusBreakdown[order.order.status] =
      (metrics.statusBreakdown[order.order.status] || 0) + 1;
  });

  // Calcular receita por dia
  const revenueByDay = orders.reduce((acc, order) => {
    const date = new Date(order.order.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + order.items.price * order.items.quantity;
    return acc;
  }, {});

  metrics.revenueByDay = Object.entries(revenueByDay)
    .map(([date, revenue]) => ({
      date,
      revenue: revenue as number,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return metrics;
};

export default {
  createOrder,
  getOrderById,
  getClientOrders,
  updateOrderStatus,
  getStoreOrders,
  getStoreMetrics,
};
