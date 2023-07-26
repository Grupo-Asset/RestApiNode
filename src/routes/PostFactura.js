const { Router } = require('express');
const router= Router();
const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');
const user = require("./loginV2");
const numeral = require('numeral');


//DESUSO TEMPORAL, REMPLAZADO POR /feedback (index 147)

router.post('/v1/venta', async (req, res) => {
    console.log(req.body)
    sdk.auth('c1e86f21bcc5fdedc6c36bd30cb5b596');


    
    // const { data } = await sdk.listProducts();
    
    // const listaProductos = []; 

    // for (const producto of data) {
    //     listaProductos.push(producto); // Agregar cada producto a la lista
    // }


    const { data }  = await sdk.listServices();

    const listaServicios= [];

    for (const servicio of data) {
        listaServicios.push(servicio); // Agregar cada producto a la lista
    }


    if(req.body){
        console.log(req.body);

        const fechaActual = new Date();
        const fechaUnix = Math.floor(fechaActual.getTime() / 1000);
        
        let locker = null;
        if(req.body.storage==="Almacenamiento L"){
            locker = "64662AB670EB6571F10A6942"
        }
        else if(req.body.storage==="Almacenamiento M"){
            locker = "64662A98C275900011057387"
        }
        else{
            locker = "64662A7C6B56EB8ADC009299"
        }
        

        let factura = {};
        sdk.createDocument({
            items: [
                {
                    sku: req.body.sku
                },
                {
                    serviceId: locker,
                    units:1,
                    subtotal: 0
                },
                {
                    serviceId:"645D044E23E518E60F0135A3", //SUM
                    units: req.body.sum,
                    subtotal: 0
                },
                {
                    serviceId:"64662B54CA7D9D6A830593AE", //KINDER
                    units: req.body.guarderia,
                    subtotal: 0
                },
                {
                    serviceId:"646629D3E5CA046AA701BA42", //COWORKING
                    units: req.body.cw,
                    subtotal: 0
                }
            ],
            customFields: [
                {
                    "Financiacion": "70/30",
                },
                {
                    "pago N":"1/12",
                    "Fecha":new Date().toLocaleDateString(),
                    "Valor dolar": numeral(req.body.dolarValue).format('0,0.00'), 
                    "Pago en pesos": `ARS$${numeral(req.body.amount*1.21).format('0.0,0')}`
                    },
            ],
            applyContactDefaults: true,
            contactId: req.body.user.id,
            date: fechaUnix,
            dueDate:2*fechaUnix
        }, {docType: 'invoice'}).then(({ data }) => {
            console.log(data);
            factura = data;
            console.log('factura desde create document', factura)
            console.log("aca empieza el pago. req body",req.body);
            console.log("document id",factura.id);
            console.log('factura desde pay Document', factura)
    
            //aca iria el if para ver si pago en efectivo o algo asi
            sdk.payDocument(
                {
                date: fechaUnix, 
                amount: (req.body.amount*1.21)/req.body.dolarValue}, 
                {
                docType: 'invoice',
                documentId: factura.id
                }
            )
                .then(({ data }) => console.log(data))
                .catch(err => console.error(err));
        
        }).catch(err => console.error(err)).then(
            ()=> sdk.createDocument({
                items: [
                    {
                        sku: req.body.sku
                    },
                    {
                        serviceId: locker,
                        units:1,
                        subtotal: 0
                    },
                    {
                        serviceId:"645D044E23E518E60F0135A3", //SUM
                        units: req.body.sum,
                        subtotal: 0
                    },
                    {
                        serviceId:"64662B54CA7D9D6A830593AE", //KINDER
                        units: req.body.guarderia,
                        subtotal: 0
                    },
                    {
                        serviceId:"646629D3E5CA046AA701BA42", //COWORKING
                        units: req.body.cw,
                        subtotal: 0
                    }
                ],
                customFields: [
                    {
                        "Financiacion": "70/30",
                    },
                    {
                        "pago N":"1/12",
                        "Fecha":new Date().toLocaleDateString(),
                        "Valor dolar": numeral(req.body.dolarValue).format('0,0.00'), 
                        "Pago en pesos": `ARS$${numeral(req.body.amount*1.21).format('0.0,0')}`
                        },
                ],
                applyContactDefaults: true,
                contactId: req.body.user.id,
                date: fechaUnix,
            }, {docType: 'purchaseorder'})

        );

        res.status(201).json({titulo : 'Post Facturas con exito👌👍'});


    // res.send(user.getUser);
    // console.log("se ejecuto postfact")
    // console.log(user.getUser.email);


}
    else{
        res.status(400).send({ error: 'faltan datos requeridos' });
    }
    
});
module.exports = router;