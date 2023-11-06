import { UserModel } from "../models/user.js";
import { FacturaModel } from "../models/factura.js";
import { PurchaseOrderModel } from "../models/purchaseOrder.js";

export class UserController {
  
    static async getAll (req, res) {
      const usuarios = await UserModel.getAll();
      res.json(usuarios)
    }

    static async login (req, res) {
      try {
        const { email, password } = req.query;
        const userDTO = await UserModel.getUser(email, password);
        const { facturasDeUser, productsOwn, servicesOwn } = await FacturaModel.processFacturas(userDTO.id);
        userDTO.facturasDeUser = facturasDeUser;
        userDTO.productsOwn = productsOwn;
        userDTO.servicesOwn = servicesOwn;
        userDTO.ordenesCompra = await PurchaseOrderModel.processPurchaseOrder(userDTO.id)
        res.json(userDTO);
      } catch (error) {
        res.json({ error: 'Credenciales inválidas' });
      }
    }
}
