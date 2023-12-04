import { InventoryModel } from "../models/inventory.js";
export class InventoryController {
    constructor(){
        if (InventoryController.instance){
            return InventoryController.instance;
        }
        InventoryController.instance = this;
        this.inventoryModel = new InventoryModel();
    }

   static async getAllProducts(req,res){
        try{
            const products = await this.inventoryModel.getAllProducts()
            return res.json(products)
        }catch(error) {
            console.log("error inventory controller, error:", error);

            return res.status(500).json(
                {
                    error: true,
                    message: "Failed in server"
                }
            )
        }
    }
    
   static async getAllServices(req,res){
        try{
            const products = await this.inventoryModel.getAllServices()
            return res.json(products)
        }catch(error) {
            console.log("error inventory controller, error:", error);

            return res.status(500).json(
                {
                    error: true,
                    message: "Failed in server"
                }
            )
        }
    }
}
