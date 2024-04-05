import axios from 'axios';
import { Bcra, DolarHoy, Ambito } from '../models/dolar.js'
import numeral from 'numeral';
class PaymentService {

    test(){return true}
    

    async createInvoice(req){

        const {userId, productSKU, financiation, dolarValue,transactionAmount,quantity} = req
        const fechaUnix = Math.floor(new Date().getTime() / 1000);
        console.log(userId)
        console.log('userId:', userId);
        console.log('productSKU:', productSKU);
        const options = {
            method: 'POST',
            url: 'https://api.holded.com/api/invoicing/v1/documents/invoice',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
            },
            data: {
                contactId: userId,
                items: [{sku: productSKU, units: quantity?quantity:1, tax:21}],
                customFields: [
                    {
                        "Financiacion": financiation,
                        "Pago N": 1
                    },
                    {
                        "Descripcion": (financiation == 'contado'?"1/2": '0/12'),
                        "Fecha": new Date().toLocaleDateString()
                    },
                    {
                        "Valor dolar": numeral(dolarValue).format('0,0.00'),
                        "Pago en pesos": `ARS$${numeral(transactionAmount * 1.21).format('0.0,0')}`
                    },
                ],
                date: fechaUnix
            }
          };
          
          return axios
            .request(options)
            .then(function (response) {
              console.log("termino createInvoice en nais:",response);
              return response 
            })
            .catch(function (error) {

                console.error("termino createInvoice en error:",error);
              return error
            });
        }
    async updateInvoice(req){
         const {info} = await this.getInvoice(req.invoiceId)
         let cuota = parseInt(info.customFields[3].value)
        switch (req.financiation){
            case '100':
                console.log();
                break
            case '70/30':
                console.clear();
                break
            default:
                console.log();
                break
            
        }
        //falta la forma de manejar el tema de la cantidad de cuotas y ya esta todo
        const options = {
            method: 'PUT',
            url: `https://api.holded.com/api/invoicing/v1/documents/invoice/${req.invoiceId}`,
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
            },
            data: {
                customFields: [
                    { field: 'Pago N', value: (cuota + 1) },
                    { field: 'Pago en pesos', value: `ARS$${numeral(req.transactionAmount * 1.21).format('0.0,0')}` },
                    {"Valor dolar": numeral(req.dolarValue).format('0,0.00'),}
                ]
            }
          };

          return axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            return response 
          })
          .catch(function (error) {
            console.error(error);
            return error
          });

    }
    async payInvoice(req) {
    const fechaUnix = Math.floor(new Date().getTime() / 1000);

    const options = {
    method: 'POST',
    url: `https://api.holded.com/api/invoicing/v1/documents/invoice/${req.invoiceId}/pay`,
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
    },
    data: {
        date: fechaUnix,
        amount: req.transactionAmount
    }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response
        //status 1 si funciono y 0 si hubo un problema
    } catch (error) {
        console.error(error);
        return response
    }
    }
    async getInvoice(req) {
    try {
        console.log("\n\n\n\n\n\nn\n\n\n\n\n\n", req.query);
        const options = {
        method: 'GET',
        url: `https://api.holded.com/api/invoicing/v1/documents/invoice/${req.query.id}`,
        headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
        };
        
        const factura = await axios.request(options);
        console.log("\n\n\n\nn\\n\n\n\n, Factura response", factura.data);
    
        return { status: "FACTURA 📄🤖BIP BOP", error: false, info: factura.data };
    } catch (error) {
        console.error(error);
        
        if (error.response) {
        // Si hay una respuesta de error del servidor
        const errorMessage = error.response.data.message;
        const statusCode = error.response.status;
        
        return {
            status: `Error en la obtención de factura: ${statusCode}`,
                error: true,
            info: error.code,
            extra: "olso its possible invoice not found :)"
        };
        } else {
        // Si ocurre algún otro tipo de error
        return {
            status: "Error en la obtención de factura",
            error: true,
            info: error.message
        };
        }
    }
    }
    async getDolarByPage(page) {
    if (page === 'bcra') {
        const dolarBCRA = Bcra.getDolar();
        return dolarBCRA
    } else if (page === 'dolarHoy') {
        const dolarHoy = DolarHoy.getDolarHoy();
        return dolarHoy
    } else {
        const dolarAmbito = Ambito.getDolar();
        return dolarAmbito
    }
    }

    async getDocumentPDF(doctype, id){
        try{
           const response = await axios.request({
             method: 'GET',
             url: `https://api.holded.com/api/invoicing/v1/documents/${doctype}/${id}/pdf`,
             headers: {accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'}
           })
           if (response.status === 200) {
             return response
           } else {
             return {error: true, status: response.status}
           }
        } catch (err) {
         console.error(err);
         return {error: true, message: err.message};
         }
     }

     async createRecibe(req){
        const {userId, productSKU, financiation, dolarValue,transactionAmount,quantity} = req
        const fechaUnix = Math.floor(new Date().getTime() / 1000);
        const options = {
            method: 'POST',
            url: 'https://api.holded.com/api/invoicing/v1/documents/purchaseorder',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
            },
            data: {
              contactId: userId,
              items: [{sku: productSKU, units: quantity?quantity:1, tax:21}],
              customFields: [
                {
                    "Financiacion": financiation,
                },
                {
                    "Descripcion": (financiation == 'contado'?"1/2": '0/12'),
                    "Fecha": new Date().toLocaleDateString(),
                    "Valor dolar": numeral(dolarValue).format('0,0.00'),
                    "Pago en pesos": `ARS$${numeral(transactionAmount * 1.21).format('0.0,0')}`
                },
            ],
              date: fechaUnix
            }
          };
          
          return axios
            .request(options)
            .then(function (response) {

              console.log('create recibe gud',response.data);
              return response 
            })
            .catch(function (error) {
              console.error(error);
              return error
            });
        }
     

}

export default PaymentService;