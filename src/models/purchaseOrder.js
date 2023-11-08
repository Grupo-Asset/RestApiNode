import axios from 'axios';


let listaOrdenesCompras;
try {
    
    const options = {
        method: 'GET',
        url: 'https://api.holded.com/api/invoicing/v1/documents/purchaseorder',
        headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);
    if (response.status === 200) {
        listaOrdenesCompras = response.data;
    } else {
        console.error(`Error: ${response.status}`);
        res.status(response.status).send({ error: 'Error al obtener datos' });
    }
} catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
    }


export class PurchaseOrderModel {
    static async processPurchaseOrder(userId){
        return listaOrdenesCompras.filter(purchaseOrden => purchaseOrden.contact === userId);
    }
}