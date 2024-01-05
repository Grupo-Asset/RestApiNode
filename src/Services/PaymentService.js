import axios from 'axios';
import { Bcra, DolarHoy, Ambito } from '../models/dolar.js'
class PaymentService {

    test(){return true}
    
    async createPayment(req) {
    const url = "https://api.mercadopago.com/checkout/preferences";;
    let items= [];


	//lote
    items.push({
		title: req.body.description,
		unit_price: Number(req.body.amount),
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
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
		},
		auto_return: "approved",//approved, all deberia ser automatico
		// notification_url: "http://localhost:3000/feedback",
	};
	console.log(preference)

    const payment = await axios.post(url, preference, {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_API_KEY}`
    }
    });

    return payment.data;
    }

    async createSubscription() {
    const url = "https://api.mercadopago.com/preapproval";

    const body = {
        "back_url": "https://www.google.com",
        "reason": "Test Subscription",
        "auto_recurring": {
            "frequency": 1,
            "frequency_type": "months",
            "start_date": "2023-06-02T13:07:14.260Z",
            "end_date": "2024-07-20T15:59:52.581Z",
            "transaction_amount": 10,
            "currency_id": "ARS"
        },
        "payer_email": "test_user_1721412825@testuser.com",
        
        "status": "authorized"
    };

    const subscription = await axios.post(url, body, {
        headers: {
        "Content-Type": "application/json",
        "X-scope": "stage",
        Authorization: `Bearer ${process.env.MP_API_KEY}`
        }
    });

        return subscription.data;
    }

    async getFactura(req) {
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
    }//perdon se me esta zafando la chiripiorka por que quedan 24 horas para terminar esta wea
//y me quedan 24 horas paraa el segundo parcial de analisis matematico II
//para el cual no estudie en todoa la semana para terminar esta wea
//🥴😵‍💫


    async payInvoice(req) {
    const fechaUnix = Math.floor(new Date().getTime() / 1000);

    const options = {
    method: 'POST',
    url: 'https://api.holded.com/api/invoicing/v1/documents/invoice/123/pay',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
    },
    data: {
        date: fechaUnix,
        amount: req.body.amount
    }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);

    } catch (error) {
        console.error(error);
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
     

}

export default PaymentService;