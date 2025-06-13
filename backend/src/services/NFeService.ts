import asaasClientService from "./asaasClientService";
import { db } from "../index.js";
import { ordersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export class NFEService {
  async emitNFE(orderId: string) {
    try {
      // Buscar dados do pedido
      const order = await db.query.ordersTable.findFirst({
        where: eq(ordersTable.id, orderId),
        with: {
          client: true,
          items: {
            with: {
              item: true,
            },
          },
          store: {
            with: {
              account: true, // Buscar dados da conta Asaas da loja
            },
          },
        },
      });

      if (!order?.payment_id || !order.store.account?.api_key) {
        throw new Error(
          "Order not found, payment not processed, or store account not configured"
        );
      }

      // Preparar dados para NF-e
      const nfeData = {
        paymentId: order.payment_id,
        customerName: order.client.name,
        customerCpfCnpj: order.client.cpf,
        customerEmail: order.client.email,
        value: order.total,
        serviceDescription: `Venda de produtos - Pedido #${order.id}`,
        municipalServiceCode: order.store.municipal_service_code, // Código do serviço municipal
        municipalServiceName: "Venda de Mercadorias",
      };

      // Emitir NF-e via Asaas
      const nfeResponse = await asaasClientService.createNFE(nfeData);

      // Atualizar pedido com dados da NF-e
      await db
        .update(ordersTable)
        .set({
          nfe_id: nfeResponse.id,
          nfe_number: nfeResponse.number,
          nfe_status: nfeResponse.status,
          nfe_url: nfeResponse.invoiceUrl,
        })
        .where(eq(ordersTable.id, orderId));

      return nfeResponse;
    } catch (error) {
      console.error("Error emitting NFE:", error);
      throw new Error(`Failed to emit NFE: ${error.message}`);
    }
  }

  async getNFEStatus(nfeId: string) {
    try {
      const response = await asaasClientService.asaasClientService.get(
        `/invoices/${nfeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting NFE status:", error);
      throw new Error("Failed to get NFE status");
    }
  }
}
