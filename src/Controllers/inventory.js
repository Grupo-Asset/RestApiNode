import  InventoryModel  from "../models/inventory.js";
export class InventoryController {
    constructor(){
        if (InventoryController.instance){
            return InventoryController.instance;
        }
        InventoryController.instance = this;
        this.inventoryModel = new InventoryModel();
    }
    static async help(req,res){
        return res.status(200).json( {
            products: {
                endPoint: "/products",
                function: "getAllProducts"
            },
            services:{
                endPoint:"/services",
                function: "getAllServices"
            }
        })
    }

    static async getProducts(req,res){
        try{
            const {proyectId} = req.query
            if(proyectId){
                try{
                    const products = await InventoryModel.getProductsByProject(proyectId)
                    const date = new Date()
                    return res.json({date: date, data: products});
                }catch(error) {
                    console.log("error inventory controller, error:", error);
        
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Failed in server"
                        }
                    )
                }
            }else{
                try{
                    const products = await InventoryModel.getAllProducts()
                    const date = new Date()
                    return res.json({date: date, data: products});
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
            const products = await InventoryModel.getAllServices()
            const date = new Date()
            return res.json({date: date, data: products});
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
