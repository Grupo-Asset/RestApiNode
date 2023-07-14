let transfer= '';
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mercadopago = require('mercadopago');
const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');
const ventaRouter = require('./routes/PostFactura')
const numeral = require('numeral');
// Configuración del puerto
const PORT = 8080;
require('dotenv').config();
//test
const PaymentController = require("./Controllers/PaymentController");
const PaymentService = require("./Services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());

const FunnelController = require("./Controllers/FunnelController");
const FunnelService = require("./Services/FunnelService");
const FunnelInstance = new FunnelController(new FunnelService());



const path = require('path');
const { default: axios } = require('axios');
const filePath = path.join(__dirname, 'index.html');
app.get("/", function (req, res) {
	res.status(200).sendFile(filePath);
});




//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extebded: false}));
app.use(express.json());
app.use(cors());

//routes
app.use(require('./routes/test'));
//POST
app.use(require('./routes/PostFactura'));//v1/venta
app.use(require('./routes/Register'));
//GET
app.use(require('./routes/getAll'));//contactos
app.use(require('./routes/login'));
app.use(require('./routes/loginV2'));
app.use(require('./routes/getAllProducto'));
app.use(require('./routes/getAllServicio'));
app.use(require('./routes/getAllFacturas'));
app.use(require('./routes/uptadeUser'));
app.use(require('./routes/getFacturaPDF'));
app.use(require('./routes/getDolar'));

//starting
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
// Manejo de error si el puerto ya está en uso
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    console.log(`Port ${PORT} is already in use. Using next available port...`);

    // Iniciar el servidor en el puerto 3001
    const nextServer = app.listen(3001, () => {
        const nextPort = nextServer.address().port;
        console.log(`Server listening on port ${nextPort}`);
    });
});



mercadopago.configure({
	access_token: process.env.MP_API_KEY, //acces de prueba test user 1
});


// app.use(express.static("../../client/html-js"));
let userId;
let date;
let products= [];
let payment_id;
app.post("/create_preference", (req, res) => {
	transfer = req.body.transfer
    console.log(req.body);
    console.log('req.body stringify\n\n\n');
    console.log(JSON.stringify(req.body));
    console.log('\n\n\nreq.body stringify FIN\n\n\n');


	let items= [];


	//lote
	// items.push({
	// 	title: req.body.description,
	// 	unit_price: Number(req.body.price),
	// 	quantity: Number(req.body.quantity),
	// });
	items.push({
		title: req.body.description,
		unit_price: Number(req.body.amount),
		quantity: 1,
	});


	//tax
	items.push({
		title: "Tax",
		unit_price: Number((req.body.amount*0.21)),
		quantity: 1,

	})

	let preference = {
		items: items,
		back_urls: {
			"success": `http://localhost:8080/${req.body.backURL}`,
			"failure": `http://localhost:8080/${req.body.backURL}`,
			"pending": `http://localhost:8080/${req.body.backURL}`
		},
		auto_return: "approved",//approved, all deberia ser automatico
		// notification_url: "http://localhost:3000/feedback",
	};
	console.log(preference)


	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
            console.log(response.body)
		}).catch(function (error) {
			console.log(error);
		});

		userId = req.body.user.id;
		payment_id = req.body.payment_id;

});

app.get('/feedback', async function (req, res) {
	console.log('req.query desde /feedback');
	console.log(req.query);
	console.log('transfer:',transfer)
	




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


    if(transfer){
        console.log(transfer);

        const fechaActual = new Date();
        const fechaUnix = Math.floor(fechaActual.getTime() / 1000);
        
        let locker = null;
        if(transfer.storage==="Almacenamiento L"){
            locker = "64662AB670EB6571F10A6942"
        }
        else if(transfer.storage==="Almacenamiento M"){
            locker = "64662A98C275900011057387"
        }
        else{
            locker = "64662A7C6B56EB8ADC009299"
        }
        

        let factura = {};
        sdk.createDocument({
            items: [
                {
                    sku: transfer.sku
                },
                {
                    serviceId: locker,
                    units:1,
                    subtotal: 0
                },
                {
                    serviceId:"645D044E23E518E60F0135A3", //SUM
                    units: transfer.sum,
                    subtotal: 0
                },
                {
                    serviceId:"64662B54CA7D9D6A830593AE", //KINDER
                    units: transfer.guarderia,
                    subtotal: 0
                },
                {
                    serviceId:"646629D3E5CA046AA701BA42", //COWORKING
                    units: transfer.cw,
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
                    "Valor dolar": numeral(transfer.dolarValue).format('0,0.00'), 
                    "Pago en pesos": `ARS$${numeral(transfer.amount*1.21).format('0.0,0')}`
                    },
            ],
            applyContactDefaults: true,
            contactId: transfer.user.id,
            date: fechaUnix,
            dueDate:2*fechaUnix
        }, {docType: 'invoice'}).then(({ data }) => {
            console.log(data);
            factura = data;
            console.log('factura desde create document', factura)
            console.log("aca empieza el pago. req body",transfer);
            console.log("document id",factura.id);
            console.log('factura desde pay Document', factura)
    
            //aca iria el if para ver si pago en efectivo o algo asi
            sdk.payDocument(
                {
                date: fechaUnix, 
                amount: (transfer.amount*1.21)/transfer.dolarValue}, 
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
                        sku: transfer.sku
                    },
                    {
                        serviceId: locker,
                        units:1,
                        subtotal: 0
                    },
                    {
                        serviceId:"645D044E23E518E60F0135A3", //SUM
                        units: transfer.sum,
                        subtotal: 0
                    },
                    {
                        serviceId:"64662B54CA7D9D6A830593AE", //KINDER
                        units: transfer.guarderia,
                        subtotal: 0
                    },
                    {
                        serviceId:"646629D3E5CA046AA701BA42", //COWORKING
                        units: transfer.cw,
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
                        "Valor dolar": numeral(transfer.dolarValue).format('0,0.00'), 
                        "Pago en pesos": `ARS$${numeral(transfer.amount*1.21).format('0.0,0')}`
                        },
                ],
                applyContactDefaults: true,
                contactId: transfer.user.id,
                date: fechaUnix,
            }, {docType: 'purchaseorder'})

        );}








	
	res.redirect(`http://localhost:3000/?status=${req.query.status}`)
	// res.json({
	// 	Payment: req.query.payment_id,
	// 	Status: req.query.status,
	// 	MerchantOrder: req.query.merchant_order_id
	// });
	//IMPACTO CON HOLDED
	sdk.auth('c1e86f21bcc5fdedc6c36bd30cb5b596');


});

//preparado para un futuro refactor de pagos  y aplicar mejor mvc
app.post("/payment", (req, res) => {
	transfer = req.body
	console.log("req.body /payment:",req.body)
	PaymentInstance.getPaymentLink(req, res);
});

app.get("/subscription", (req, res) => {

	PaymentInstance.getSubscriptionLink(req,res);
});

app.get("/v1/getDatosFactura",(req,res) => {
	PaymentInstance.getDatosFactura(req,res);
});

app.post("/v1/payInvoice",(req,res) => {
	PaymentInstance.payInvoice(req,res);
	// PaymentInstance.updateInvoice(req,res);
})

app.post("/funnelSub", (req,res) => {
	// suscribe un usuario a un funnel especifico en una etapa especifica
	// si el usuario ya existe y la etapa es distina (despeus) lo movera
	FunnelInstance.postUser(req,res);
})