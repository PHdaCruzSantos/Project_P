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
