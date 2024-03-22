import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as config from "../config.js";
import axios from 'axios';
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
      const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
      const preference = new Preference(mpClient);
      const {description, amount, tax, quantity, currency_id, title} = req.body;
      
        try{
            const purchasedItems= [];

            //lote
            purchasedItems.push({
                title: title,
                unit_price: amount,
                quantity: quantity,
                description: description,
                currency_id: currency_id,
            });
        
        
            // tax
            if(tax){
              purchasedItems.push({
                    title: "Producto con impuesto",
                    unit_price: Number((req.body.amount*req.body.tax)),
                    quantity: 1,
                    description: "Impuesto a la compra de la propiedad",
                    currency_id: "ARS",            
                })
                
            }

            await preference.create({
              body: {
                items: purchasedItems,
                redirect_urls: {
                  "success": `${config.HOST}`,
                  "failure": `${config.HOST}/feedback`,
                  "pending": `${config.HOST}/feedback`
              },
              back_urls: {
                "success": `${config.HOST}`,
                "failure": `${config.HOST}/feedback`,
                "pending": `${config.HOST}/feedback`
              },
              notification_url: `${config.HOST}/payment/webhook`,
              auto_return: "approved", 
              additional_info: JSON.stringify({invoiceId:"1234"}),
              external_reference: JSON.stringify({invoiceId:"1234"}),
              payer: {
                name: "Lalo",
                surname: "Landa",
                email: "lalo@landa.com",
                phone: {
                  area_code: "52",
                  number: 5549737300
                },
                address: {
                  street_name: "Insurgentes Sur",
                  street_number: 1602,
                  zip_code: "03940"
                },                
              },
            }
            })
            .then(
              (response) => {
                console.log(response);
                res.json({ "url": response.init_point, "sandbox_init_point": response.sandbox_init_point, response});
              }
            )
            .catch(console.log);
        
            /* let preference = {
                items: items,
                back_urls: {
                    "success": `${config.HOST}`,
                    "failure": `${config.HOST}/feedback`,
                    "pending": `${config.HOST}/feedback`
                },
                notification_url: `${config.HOST}/payment/webhook`,
                auto_return: "approved", 
                //approved, all deberia ser automatico
                // notification_url: "http://localhost:3000/feedback",
            }; */
            
            //const result = await mercadopago.preferences.create(preference);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Error creating MercadoPago preference",
    });
  }
}
    
    static async mpWebHook(req, res){
          const APPROVED = "approved";
          const ACCREDITED = "accredited";
          const receivedPayment = req.query;
          console.log('receivedPayment', receivedPayment)
          
          try {
              if (receivedPayment.type === "payment"){
                const id = receivedPayment['data.id'];
                const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
                const payment = new Payment(mpClient);
                const data = await payment.get({id});
                const {status_detail, status} = data;
                if (status == APPROVED) {
                  console.log("pago aprobado");
                }
                if (status_detail == ACCREDITED) {
                  //aca deberia generarse la factura, se puede usar external_reference para guardar el id de la factura de holded
                  console.log("pago acreditado");
                }
                console.log(data);

                //o buscar una existente y agregarle el pago
                res.json(data)
            } else {
                console.log(receivedPayment.type)
                res.status(204).send();
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
                return_url: `${config.HOST}/capture-order`,
                cancel_url: `${config.HOST}/cancel-payment`,
              },
            };
        
            // format the body
            const params = new URLSearchParams();
            params.append("grant_type", "client_credentials");
        
            // Generate an access token
            const {
              data: { access_token },
            } = await axios.post(
              `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
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
        
            console.log(await access_token);
        
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
            return res.status(500).json("Something goes wrong. catching error");
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