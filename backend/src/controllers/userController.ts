import userServices from "@/services/userService";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userById = await userServices.getUserById(id);

    res.status(200).json(userById);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    console.log(user);
    const newUser = await userServices.createUser(user);
    if (!newUser) {
      res.status(404).json({ message: "User not created" });
    }
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.body;
    const updateUser = await userServices.updateUser(id, user);
    if (!updateUser) {
      res.status(404).json({ message: "User not updated" });
    }
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(404).json({ message: "Controller", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deletedUser = await userServices.deleteUser(id);
    if (!deletedUser) {
      res.status(404).json({ message: "User not deleted" });
    }
    res.status(200).json({ message: "Deleted User successfully" });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
