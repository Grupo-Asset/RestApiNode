class FunnelController {
    constructor(funnelService){
        this.funnelService = funnelService;
    }

    async getFunnel(){
        try{
            const funnel = await this.funnelService.getFunnel();

            return funnel;
        }catch(error){
            console.log("error funnel controller", error);
            return error;
        }
    }

    async postUser(req,res){
        try{
            const suscription = await this.funnelService.postUser(req);
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

    
}
export default FunnelController;
//lo anoto aca para no olvidarme
// puedo hacer que solo se haga una compra si no existe el lead con el
//  producto relacionado en notas
