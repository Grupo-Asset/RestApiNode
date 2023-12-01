class InventoryController {
    constructor(){
        if (InventoryController.instance){
            return InventoryController.instance;
        }
        InventoryController.instance = this;
        inventoryModel = new InventoryModel();
    }

    async getAllProducts(req,res){
        try{
            const products = await inventoryModel.getAllProducts()
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
    
    async getAllServices(req,res){
        try{
            const products = await inventoryModel.getAllServices()
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