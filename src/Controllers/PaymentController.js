export class PaymentController {
    static paymentService;

    constructor(paymentService) {
        PaymentController.paymentService = paymentService;
    }

    static async getDolar(req,res){
        const dolarInfo = await PaymentController.paymentService.getDolarByPage(req.query.page)
        res.status(200).json(dolarInfo)
    }
    
    static async help(req, res) {
        let serviceStatus = "error";
        if (PaymentController.paymentService.test()) {
            serviceStatus = "initialized";
        } else {
            serviceStatus = "error";
        }
        return res.status(200).json({
            help: "this is more like a test",
            status: serviceStatus
        });
    }
    
    static async getPaymentLink(req, res) {
        try{
            const payment = await PaymentController.paymentService.createPayment(req);
            console.log('\n\n\n\n\n\n\n\n\n\n PAYMENT.data QUE DEVOLVIO MP AL CREATEPREFERENCE\n',payment)
            return res.json(payment); 

        } catch(error) {
            console.log("error payment controller", error);

            return res.status(500).json(
                {
                    error: true,
                    message: "Failed to create payment from controller"
                }
            );
        }
    }
    
    static async getSubscriptionLink(req, res) {
        try{
            const subscription = await PaymentController.paymentService.createSubscription();

            return res.json(subscription);
        }catch(error) {
            console.log("error subscription controller", error);
            
            return res.status(500).json(
                {
                    error: true,
                    message: "Failed to create a new subcription."
                }
            )
        }
    }

    static async getDatosFactura(req, res) {
        try{
            const factura = await PaymentController.paymentService.getFactura(req);

            return res.json(factura);
        }catch(error) {
            console.log(" 📄🤖BIP BOP error en la obtencion de factura", error);
            
            return  res.status(500).json(
                {
                    error: true,
                    message: "📄🤖BIP BOP error en la obtencion de factura",
                    info: "☆*: .｡. o(≧▽≦)o .｡.:*☆"
                }
            )
        }
    }

    static async getDocumentPDF(req, res){
        try{
            if (!req.query.doctype || !req.query.id) {
                return res.status(400).json({
                    error: true,
                    message: "doctype and id are required"
                });
            }
            const pdf = await PaymentController.paymentService.getDocumentPDF(req.query.doctype ,req.query.id)
            return res.status(200).send(pdf)
        }catch(error){
            console.error("error in controller",error)
            return res.status(500).json(
                {
                    error: true,
                    message: `Failed to create payment from controller: ${error.message}`
                }
            )
        }
    }
    

    static async payInvoice(req, res) {
        try {
        const factura = await PaymentController.paymentService.payInvoice(req);
    
        return res.json(factura);
        } catch (error) {
        console.log("📄🤖BIP BOP error al agregar el pago", error);
    
        return res.status(500).json({
            error: true,
            message: "📄🤖BIP BOP error al pagar",
            info: "☆*: .｡. o(≧▽≦)o .｡.:*☆"
        });
        }
    }
    
    static async updateInvoice(req, res) {
        try {
        const factura = await PaymentController.paymentService.updateInvoice(req);
    
        return res.json(factura);
        } catch (error) {
        console.log("📄🤖BIP BOP error al actualizar", error);
    
        return res.status(500).json({
            error: true,
            message: "📄🤖BIP BOP error al actualizar",
            info: "pago realizado pero no impactado"
        });
        }
    }

}
export default PaymentController;