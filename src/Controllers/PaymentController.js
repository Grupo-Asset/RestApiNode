import mercadopago from "mercadopago";
import * as config from "../config.js";
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

    static async mpCreateOrder(req, res) {
        try{
            let items= [];


            //lote
            items.push({
                title: "req.body.description",
                unit_price: 1234,
                quantity: 1,
            });
        
        
            // tax
            if(req.body.tax){
                items.push({
                    title: "Tax",
                    unit_price: Number((req.body.amount*req.body.tax)),
                    quantity: 1,
            
                })
                
            }
        
            let preference = {
                items: items,
                back_urls: {
                    "success": `${config.HOST}`,
                    "failure": `${config.HOST}/feedback`,
                    "pending": `${config.HOST}/feedback`
                },
                notification_url: `${config.HOST}/payment/webhook`,
                auto_return: "approved",//approved, all deberia ser automatico
                // notification_url: "http://localhost:3000/feedback",
            };
            
            const result = await mercadopago.preferences.create(preference);
    console.log(result);
    res.json(result.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error creating MercadoPago preference",
    });
  }
}
    
    static async mpWebHook(req, res){
        const payment = req.query;
        
        try {
            if(payment.type === "payment"){
            const data = await mercadopago.payment.findById(payment['data.id'])
            console.log(data);
            //aca deberia crearce la factura
            //o buscar una existente y agregarle el pago
            res.status(204)
            }
        }catch (error){
            console.log(error)
            return res.status(500).json({error: "error"})
        }

    }

    static async mpSuccess(req,res){
      res.redirect("http://localhost:3000/?status=${req.query.status}");
    }
    static async mpFailure(req,res){
      res.redirect("http://localhost:3000/?status=${req.query.status}");  
    }
    static async mpPending(req,res){
      res.redirect("http://localhost:3000/?status=${req.query.status}");   
    }

    static async ppCreateOrder(req, res){
        try {
            const order = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: "105.70",
                  },
                },
              ],
              application_context: {
                brand_name: "mycompany.com",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${HOST}/capture-order`,
                cancel_url: `${HOST}/cancel-payment`,
              },
            };
        
            // format the body
            const params = new URLSearchParams();
            params.append("grant_type", "client_credentials");
        
            // Generate an access token
            const {
              data: { access_token },
            } = await axios.post(
              `${config.HOST}/v1/oauth2/token`,
              params,
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                  username: config.PAYPAL_API_CLIENT,
                  password: config.PAYPAL_API_SECRET,
                },
              }
            );
        
            console.log(access_token);
        
            // make a request
            const response = await axios.post(
              `${config.PAYPAL_API}/v2/checkout/orders`,
              order,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
        
            console.log(response.data);
        
            return res.json(response.data);
          } catch (error) {
            console.log(error);
            return res.status(500).json("Something goes wrong");
          }
    }
    static async ppCaptureOrder(req, res){
        const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(response.data);

    res.redirect("http://localhost:3000/?status=${req.query.status}");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
    }
    static async ppCancelPayment(req, res){
        res.redirect("/")
    }

}
export default PaymentController;