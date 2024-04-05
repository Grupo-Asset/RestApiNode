import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import * as config from "../config.js";
import axios from 'axios';

export class PaymentController {

    static paymentService;

    constructor(paymentService){
        PaymentController.paymentService = paymentService;
    }

    static async getDolar(req,res){
        const dolarInfo = await PaymentController.paymentService.getDolarByPage(req.query.page)
        console.log("el dolar llego al controlador con el valor ",await dolarInfo)
        res.status(201).json(await dolarInfo)
    }
    
    static async help(req, res){
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
    
    static async getPaymentLink(req, res){
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
    
    static async getSubscriptionLink(req, res){
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

    static async getDatosFactura(req, res){
        try{
            const factura = await PaymentController.paymentService.getInvoice(req);

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
    //para usar esta funcion payInvoice() se le debe pasar un objeto por 
    //parametro que contenga el id de la fc, el monto a pagar,
    //el nombre del producto, el id del usuario
    //el tipo de financiacion
    //una descripcion
    //el valor del dolar
    //
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
    
    static async updateInvoice(req, res){
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
      const {
        product, 
        user, 
        financiation, 
        dolarValue, 
        quantity,
        transactionAmount, 
        invoiceId
            } = req.body;

        try{
            let transfer= {
              userId :            user.id,
              dolarValue:         dolarValue,
              transactionAmount:  transactionAmount,
              financiation:       financiation

            };

            //lote
            const purchasedItems =[{
                title:        product.name,
                unit_price:   transactionAmount,
                quantity:     quantity,
                description:  "producto",
                currency_id:  "ARS",
            }];
        
            if(invoiceId){
              transfer["invoiceId"]=  invoiceId;
              //si es invoice podria ver cual es la factura y el plan de pago
              //para determinar cuanto es el monto a pagar sin que lo mande el frotn
            }else{
              transfer["productSKU"]= product.sku;
              transfer['quantity']=   quantity;
              //caso contrario ver el precio del producto y pedir el 10% + IVA
              //seria muy util que sea una funcion y que se pueda usar por endpoint
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
                "failure": `${config.HOST}`,
                "pending": `${config.HOST}/feedback`
              },
              notification_url:   `https://edde-2803-9800-a142-8002-81ed-c2b-784f-e6d3.ngrok-free.app/payment/webhook`,
              auto_return:        "approved", 
              external_reference: JSON.stringify(transfer),
            }
            })
            .then(
              (response) => {
                console.log(response.init_point);
                // res.json({ "url": response.init_point, "sandbox_init_point": response.sandbox_init_point, response});
                res.json({ "url": response.init_point});
              }
            )
            .catch(console.log);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Error creating MercadoPago preference",
    });
  }
    }
    
    static async mpWebHook(req, res){
          const APPROVED = "approved";
          const ACCREDITED = "accredited";
          const receivedPayment = req.query;
          // console.log('receivedPayment', receivedPayment)
          
          try {
              if (receivedPayment.type === "payment"){
                const id = receivedPayment['data.id'];
                const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
                const payment = new Payment(mpClient);
                const data = await payment.get({id});
                let {status_detail, status, external_reference} = data;
                external_reference = JSON.parse(external_reference) 
                if (status == APPROVED) {
                  console.log("pago aprobado");
                  // console.log(req.body)
                }
                if (status_detail == ACCREDITED) {
                  if(external_reference.invoiceId){
                    //aca deberia crearse un recibo que es un purchaseOrder
                    //por ahora solo va a pagar el invoice y actualizar los customFields
                    PaymentController.paymentService.updateInvoice(external_reference);
                    PaymentController.paymentService.payInvoice(external_reference);
                    PaymentController.paymentService.createRecibe(external_reference);
                  }else{
                    //aca se va a crear el invoice y luego pagarlo
                    PaymentController.paymentService.createRecibe(external_reference);
                    PaymentController.paymentService.createInvoice(external_reference).then((res)=>{
                      console.log("res 250" ,res)
                    external_reference['invoiceId']= res.id
                    PaymentController.paymentService.payInvoice(external_reference)
                    })
                  }
                  //aca deberia generarse la factura, se puede usar external_reference para guardar el id de la factura de holded
                  console.log("pago acreditado");
                }
                console.log(data.external_reference);
                // console.log(req)
                //o buscar una existente y agregarle el pago
                res.json(data)
            } else {
                console.log(receivedPayment.type)
                // console.log(req)
                res.status(204).send();
            }
        }catch (error){
            console.log(error)
            return res.status(500).json({error: "error", req:req})
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
      const {
        product, 
        user, 
        financiation, 
        dolarValue, 
        quantity,
        transactionAmount, 
        invoiceId
            } = req.body;

        try {

          let transfer= {
            userId :            user.id,
            dolarValue:         dolarValue,
            transactionAmount:  transactionAmount,
            financiation:       financiation

          };

          if(invoiceId){
            transfer["invoiceId"]=  invoiceId;
            //si es invoice podria ver cual es la factura y el plan de pago
            //para determinar cuanto es el monto a pagar sin que lo mande el frotn
          }else{
            transfer["productSKU"]= product.sku;
            transfer['quantity']=   quantity;
            //caso contrario ver el precio del producto y pedir el 10% + IVA
            //seria muy util que sea una funcion y que se pueda usar por endpoint
          }
          
            const order = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  reference_id: JSON.stringify(transfer),
                  amount: {
                    currency_code: "USD",
                    value: transactionAmount,
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

    if(external_reference.invoiceId){
      //aca deberia crearse un recibo que es un purchaseOrder
      //por ahora solo va a pagar el invoice y actualizar los customFields
      this.paymentService.updateInvoice(external_reference.invoiceId);
      this.paymentService.payInvoice(external_reference.invoiceId);
      this.paymentService.createRecibe(external_reference);
    }else{
      //aca se va a crear el invoice y luego pagarlo
      this.paymentService.createInvoice(external_reference).then((id)=>{
        this.paymentService.payInvoice(id);
      })
      this.paymentService.createRecibe(external_reference);
    }

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