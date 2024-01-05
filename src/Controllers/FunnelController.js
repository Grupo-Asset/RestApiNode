
export class FunnelController {
    static funnelModel;
    constructor(funnelModel){
        FunnelController.funnelModel = funnelModel;
    }

    static async getFunnel(){
        try{
            const funnel = await FunnelController.funnelModel.getFunnel();

            return funnel;
        }catch(error){
            console.log("error funnel controller", error);
            return error;
        }
    }

   static async postUser(req,res){
        try{
            const suscription = await FunnelController.funnelModel.postUser(req);
            return res.status(200).json(suscription);
        }catch(error) {
            console.log("error suscription controller", error);

            return res.status(500).json(
                {
                    error: true,
                    message: "Failed to create suscription from controller"
                }
            );
        }
    }
    static async help(req,res){
        return res.status(200).json( {help : "this is more like a test"})
    }

    
}

//lo anoto aca para no olvidarme
// puedo hacer que solo se haga una compra si no existe el lead con el
//  producto relacionado en notas
