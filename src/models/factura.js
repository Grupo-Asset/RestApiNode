import axios from 'axios';


try {
    
    const options = {
        method: 'GET',
        url: 'https://api.holded.com/api/invoicing/v1/documents?docType=invoice',
        headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);
    let listaFacturas;
    if (response.status === 200) {
        listaFacturas = response.data;
    } else {
        console.error(`Error: ${response.status}`);
        res.status(response.status).send({ error: 'Error al obtener datos' });
    }
} catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
    }


    export class FacturaModel {

        static async processFacturas(userId) {
            let productsOwn = [];
            let servicesOwn = [];
            let facturasDeUser = [];
            
            listaFacturas.forEach(factura => {
                if (factura.contact === userId) {
                facturasDeUser.push(factura);
            
                factura.products.forEach(product => {
                    if (product.serviceId) {
                    servicesOwn.push(product);
                    } else {
                    productsOwn.push(product.name);
                    }
                });
                }
            });
            
            return { facturasDeUser, productsOwn, servicesOwn };
            }
    }