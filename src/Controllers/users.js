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

    static async register(req, res) {
      try {
        const result = await UserModel.register(req.body);
        res.status(result.status).send(result.message);
      } catch (error) {
        if (error.message === 'Usuario no encontrado') {
          res.status(404).send({ error: 'Usuario no encontrado' });
        } else if (error.message === 'Faltan datos requeridos') {
          res.status(400).send({ error: 'Faltan datos requeridos' });
        } else if (error.message === 'Error al crear el contacto') {
          res.status(500).send({ error: 'Error al crear el contacto' });
        } else {
          res.status(500).send({ error: 'Error desconocido' });
        }
      }
    }
  
}
