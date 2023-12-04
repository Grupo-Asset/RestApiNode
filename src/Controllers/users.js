import { UserModel } from "../models/user.js";
import { FacturaModel } from "../models/factura.js";
import { PurchaseOrderModel } from "../models/purchaseOrder.js";
import { validateUser , validatePartialUser } from "../Services/user.js";

export class UserController {
  
    static async getAll (req, res) {
      const usuarios = await UserModel.getAll();
      res.json(usuarios)
    }

    static async login (req, res) {
      try {
        const { email, password } = req.body;
        const validation = validatePartialUser(req.body)
        console.log(validation)
        //falta testear
        if(validation.success){
        const userDTO = await UserModel.getUser(email, password);
        const { facturasDeUser, productsOwn, servicesOwn } = await FacturaModel.processFacturas(userDTO.id);
        userDTO.facturasDeUser = facturasDeUser;
        userDTO.productsOwn = productsOwn;
        userDTO.servicesOwn = servicesOwn;
        userDTO.ordenesCompra = await PurchaseOrderModel.processPurchaseOrder(userDTO.id)
        res.json(userDTO);
      } else {
          res.status(400).json({ error: JSON.parse(validation.error.message) });
        }
      } catch (error) {
        console.error(error);
        if (error.message === 'Usuario no encontrado') {
          res.status(401).json({ error: 'Usuario no encontrado' });
        } else {
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
    }

    static async register(req, res) {
      try {
        const validation = validateUser(req.body)
        console.log(validation)
        //falta testear
        if(validation.success){
        const result = await UserModel.register(req.body);
        res.status(result.status).send(result.message);
        } else {
          res.status(400).json({ error: JSON.parse(validation.error.message) });
        }
      }catch (error) {
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

    static async getById(req,res){
      const result = await UserModel.getById(req.params.id);
      res.status(200).send(result)
    }

    static async update(req,res){
      try {
        const userId = req.params.id;
        const userChanges = req.body;3
        const validation = validatePartialUser(userChanges)
        const result = await UserModel.update(userId, userChanges);
        res.status(result.status).send(result.message);
      } catch(error){
        res.status(500).send({error:error.message})
      }
    }
  
}
