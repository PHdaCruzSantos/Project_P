import clientServices from "@/services/clientServices";
import { Request, Response } from "express";

export const getClientById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const clientById = await clientServices.getClientById(id);

    res.status(200).json(clientById);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = req.body;
    const newClient = await clientServices.createClient(client);

    if (!newClient) {
      res.status(404).json({ message: "Client not created" });
    }
    res.status(201).json({ message: "Client created successfully" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const client = req.body;
    console.log(id);
    const updateClient = await clientServices.updateClient(String(id), client);

    if (!updateClient) {
      res.status(404).json({ message: "Client not updated" });
    }
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(404).json({ message: "Controller", error });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; //NOTE - ñ é nescessario usar o req.path.split("/") pois o id ja esta no req.params.id
    const deleteClient = await clientServices.deleteClient(id);

    if (!deleteClient) {
      res.status(404).json({ message: "Client not deleted" });
    }
    res.status(200).json({ message: "Deleted Client successfully" });
  } catch (error) {
    res.status(404).json({ message: "Controller", error });
  }
};

export const addFavItem = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const itemId = req.params.itemId;
    const result = await clientServices.addFavItem(clientId, itemId);

    if (!result) {
      res.status(404).json({ message: "Failed to add favorite" });
    }
    res.status(200).json({ message: "Item added to favorites" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFavItem = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const itemId = req.params.itemId;
    const result = await clientServices.removeFavItem(clientId, itemId);

    if (!result) {
      res.status(404).json({ message: "Failed to remove favorite" });
    }
    res.status(200).json({ message: "Item removed from favorites" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const clienteId = req.params.clienteId;
    const client = await clientServices.getClientById(clienteId);

    const favorites = client.fav_items
      ? client.fav_items.split(",").filter(Boolean)
      : [];
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClientAddresses = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const addresses = await clientServices.getAddressesByClientId(clientId);
    res.status(200).json(addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createClientAddress = async (req: Request, res: Response) => {
  try {
    const clientId = req.params.clientId;
    const address = await clientServices.createAddress({
      ...req.body,
      clients_id: clientId,
    });
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateClientAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const address = await clientServices.updateAddress(addressId, req.body);
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteClientAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    await clientServices.deleteAddress(addressId);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
