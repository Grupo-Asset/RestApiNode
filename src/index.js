import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mercadopago from 'mercadopago';
import path from 'path';
import axios from 'axios';
// import sdk from '@holded/v1.0#3cm531nlbw08qsz';  
// const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');



import ventaRouter from './routes/PostFactura.js';
import numeral from 'numeral';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const transfer = '';
const app = express();
const PORT = 1337;
import { config } from 'dotenv';
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = path.join(__dirname, 'index.html');
app.get("/", function (req, res) {
    res.status(200).sendFile(filePath);
});

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000',
            'https://grupo-asset.com'
        ]
        if (ACCEPTED_ORIGINS.includes(origin)){
            return callback(null,true)
        }if(!origin){
            return callback(null,true)
        }
        return callback(new Error('Not allowed by CORS'))
    }}));

// Routes
import testRouter from './routes/test.js';
// import registerRouter from './routes/Register.js';
import getAllRouter from './routes/getAll.js';
// import loginRouter from './routes/login.js';
// import loginV2Router from './routes/loginV2.js';
// import getAllProductoRouter from './routes/getAllProducto.js';
// import getAllServicioRouter from './routes/getAllServicio.js';
import getAllFacturasRouter from './routes/getAllFacturas.js';
// import uptadeUserRouter from './routes/uptadeUser.js';
import getFacturaPDFRouter from './routes/getFacturaPDF.js';
import getDolarRouter from './routes/getDolar.js';
import getDolarV2Router from './routes/getDolarV2.js';
import getDolarV3Router from './routes/getDolarV3.js';
import postFacturaRouter from './routes/PostFactura.js';
import { inventoryRouter } from './routes/inventory.js';
import { userRouter } from './routes/users.js';
import { UserModel } from './models/user.js'; // lo usa apra el init, la verdad que podria estar en el controller que ya lo importa pero no me pagan lo suficiente como para moverlo 
import { PurchaseOrderModel } from './models/purchaseOrder.js';
import { FacturaModel } from './models/factura.js';
import { funnelRouter } from './routes/funnel.js';
import { paymentRouter } from './routes/payments.routes.js';
//routes
//routes
//routes
// app.use('/routes/Register', registerRouter);
app.use('/funnel',      funnelRouter)
app.use('/routes/test', testRouter);
app.use('/v1/getall',   getAllRouter);
app.use('/v1/venta',    postFacturaRouter); // Actualizada a la ruta correcta
app.use('/user',        userRouter )
app.use('/inventory',   inventoryRouter)
app.use('/payment',     paymentRouter)


//deploy errror (borrar )
//GET
// app.use(loginRouter);
// app.use(loginV2Router);
// app.use(getAllProductoRouter);
// app.use(getAllServicioRouter);
app.use(getAllFacturasRouter);
// app.use(uptadeUserRouter);
app.use(getFacturaPDFRouter);
app.use(getDolarRouter);
app.use(getDolarV2Router);
app.use(getDolarV3Router);

// Starting
// Inicializar el modelo de usuario

// import UserController  from './Controllers/users.js';
// const userInstance = new UserController();
// userInstance.init()

import PaymentController from './Controllers/PaymentController.js';
import PaymentService from './Services/PaymentService.js';
const PaymentInstance = new PaymentController(new PaymentService());

import {FunnelController} from './Controllers/FunnelController.js';
import FunnelService from './Services/FunnelService.js';
const FunnelInstance = new FunnelController(new FunnelService());

PurchaseOrderModel.init();
FacturaModel.init();
UserModel.init().then(async () => {
    console.log('All models initialized');

    // console.log(await UserModel.test())
})
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 

// Handling error if the port is already in use
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    console.log(`Port ${PORT} is already in use. Using the next available port...`);

    // Start the server on port 3001
    const nextServer = app.listen(3001, () => {
        const nextPort = nextServer.address().port;
        console.log(`Server listening on port ${nextPort}`);
    });
});

/* mercadopago.configure({
    access_token: "TEST-5990004718573364-050309-6f5ddb7d13b533596d97451683dcf03e-1365118455", // Access token for test user 1
});  */              



let userId;
let date;
let products = [];
let payment_id;

app.post("/create_preference", (req, res) => {
    transfer = req.body.transfer;
    console.log(req.body);
    console.log('req.body stringify\n\n\n');
    console.log(JSON.stringify(req.body));
    console.log('\n\n\nreq.body stringify FIN\n\n\n');

    let items = [];

    items.push({
        title: req.body.description,
        unit_price: Number(req.body.amount),
        quantity: 1,
    });

    let preference = {
        items: items,
        back_urls: {
            "success": `https://prod-testing-development.up.railway.app/${req.body.backURL}`,
            "failure": `https://prod-testing-development.up.railway.app/${req.body.backURL}`,
            "pending": `https://prod-testing-development.up.railway.app/${req.body.backURL}`,
        },
        auto_return: "approved",
    };

    console.log(preference);

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
            console.log(response.body);
        }).catch(function (error) {
            console.log(error);
        });

    userId = req.body.user.id;
    payment_id = req.body.payment_id;
});

app.get('/feedback', async function (req, res) {
    console.log('req.query from /feedback', req.query);
    console.log('transfer:', transfer);
    const fechaActual = new Date();
    const fechaUnix = Math.floor(fechaActual.getTime() / 1000);

    sdk.auth('c1e86f21bcc5fdedc6c36bd30cb5b596');

    const { data } = await sdk.listServices();
    const listaServicios = [];

    for (const servicio of data) {
        listaServicios.push(servicio);
    }

    if (transfer) {
        if (transfer.facturaInfo) {
            console.log("\n\n Entered here\n\n");
            console.log("Transfer Data: " + transfer + "\n\n");
            console.log("Contact ID?: " + transfer.facturaInfo.contact + "\n\n");
            sdk.createDocument({
                items: [
                    {
                        name: transfer.description,
                        subtotal: (transfer.amount) / numeral(transfer.facturaInfo.customFields[3].value).format('0,0.00')
                    }
                ],
                customFields: [
                    {
                        "Financiacion": transfer.financiation,
                    },
                    {
                        "Descripcion": transfer.description,
                        "Fecha": new Date().toLocaleDateString(),
                        "Valor dolar": numeral(transfer.facturaInfo.customFields[3].value).format('0,0.00'),
                        "Pago en pesos": `ARS$${numeral(transfer.amount * 1.21).format('0.0,0')}`
                    },
                ],
                applyContactDefaults: true,
                contactId: transfer.facturaInfo.contact,
                date: fechaUnix,
            }, { docType: 'purchaseorder' }).then(async ({ data }) => {
                console.log('Updating invoice 1/2, payment:', data);
                console.log('1/2 transfer:', transfer);
                console.log('1/2 transfer custom fields:', transfer.facturaInfo.customFields);
                console.log('1/2 (transfer.amount*1.21)/transfer.dolarValue:', (transfer.amount * 1.21) / transfer.facturaInfo.customFields[3].value);
                factura = await data;
                await sdk.payDocument(
                    {
                        date: fechaUnix,
                        amount: (transfer.amount) / transfer.facturaInfo.customFields[3].value
                    },
                    {
                        docType: 'invoice',
                        documentId: transfer.facturaInfo.id
                    }
                ).then(({ data }) => console.log(data)).catch(error => console.error(error));
            }
            ).catch(error => console.error(error)).then(async () => {
                console.log('Updating invoice 2/2, customFields:', data);
                console.log('\n\n2/2 transfer:', transfer, '\n\n');
                const date = new Date().toLocaleDateString();
                const valorDolar = numeral(transfer.facturaInfo.customFields[3].value).format('0,0.00');
                const montoPesos = `ARS$${numeral(transfer.amount * 1.21).format('0.0,0')}`;
                await sdk.updateDocument({
                    customFields: [
                        { field: 'Descripcion', value: transfer.description },
                    ]
                }, {
                    docType: 'invoice',
                    documentId: transfer.facturaInfo.id
                })
                    .then(({ data }) => console.log(data))
                    .catch(err => console.error(err));
            });
        } else {
            console.log("\n\n Entered the else\n It's a purchase of 0, so the invoice is created\n",
                "This is the value of transfer:",
                transfer,
                "This is the value of req.query, all the code info",
                req.query
            );
            const fechaActual = new Date();
            const fechaUnix = Math.floor(fechaActual.getTime() / 1000);
            
            let locker = null;
            if (transfer.storage === "Almacenamiento L") {
                locker = "64662AB670EB6571F10A6942";
            } else if (transfer.storage === "Almacenamiento M") {
                locker = "64662A98C275900011057387";
            } else {
                locker = "64662A7C6B56EB8ADC009299";
            }
            
            let factura = {};
            await sdk.createDocument({
                items: [
                    {
                        sku: transfer.sku
                    },
                    {
                        serviceId: locker,
                        units: 1,
                        subtotal: 0
                    },
                    {
                        serviceId: "645D044E23E518E60F0135A3", // SUM
                        units: transfer.sum,
                        subtotal: 0
                    },
                    {
                        serviceId: "64662B54CA7D9D6A830593AE", // KINDER
                        units: transfer.guarderia,
                        subtotal: 0
                    },
                    {
                        serviceId: "646629D3E5CA046AA701BA42", // COWORKING
                        units: transfer.cw,
                        subtotal: 0
                    }
                ],
                customFields: [
                    {
                        "Financiacion": transfer.financiation,
                    },
                    {
                        "Descripcion": transfer.financiation == 'contado' ? "1/2" : "0/12",
                        "Fecha": new Date().toLocaleDateString(),
                        "Valor dolar": numeral(transfer.dolarValue).format('0,0.00'),
                        "Pago en pesos": `ARS$${numeral(transfer.amount * 1.21).format('0.0,0')}`
                    },
                ],
                applyContactDefaults: true,
                contactId: transfer.user.id,
                date: fechaUnix,
                dueDate: 2 * fechaUnix
            }, { docType: 'invoice' })
            .then(async ({ data }) => {
                console.log(data);
                factura = await data;
                console.log('factura from create document', await factura);
                console.log("Payment starts here. req body", transfer);
                console.log("document id", await factura.id);
                console.log('factura from pay Document', await factura);
                if (req.query.status != 'pending') {
                    await sdk.payDocument(
                        {
                            date: fechaUnix,
                            amount: (transfer.amount * 1.21) / transfer.dolarValue
                        },
                        {
                            docType: 'invoice',
                            documentId: factura.id
                        }
                    );
                }
            }).catch(err => console.error(err));

            await sdk.createDocument(
                {
                    items: [
                        {
                            sku: transfer.sku
                        },
                        {
                            serviceId: locker,
                            units: 1,
                            subtotal: 0
                        },
                        {
                            serviceId: "645D044E23E518E60F0135A3", // SUM
                            units: transfer.sum,
                            subtotal: 0
                        },
                        {
                            serviceId: "64662B54CA7D9D6A830593AE", // KINDER
                            units: transfer.guarderia,
                            subtotal: 0
                        },
                        {
                            serviceId: "646629D3E5CA046AA701BA42", // COWORKING
                            units: transfer.cw,
                            subtotal: 0
                        }
                    ],
                    customFields: [
                        {
                            "Financiacion": transfer.financiation,
                        },
                        {
                            "Descripcion": transfer.financiation == 'contado' ? "1/2" : "0/12",
                            "Fecha": new Date().toLocaleDateString(),
                            "Cotizacion Dolar": numeral(transfer.dolarValue).format('0,0.00'),
                            "Pago en pesos": `ARS${numeral(transfer.amount).format('0.0,0')}`
                        },
                    ],
                    applyContactDefaults: true,
                    contactId: transfer.user.id,
                    date: fechaUnix,
                }, { docType: 'purchaseorder' }
            );
        }
    }

    res.redirect(`http://localhost:3000/?status=${req.query.status}`);
    sdk.auth('c1e86f21bcc5fdedc6c36bd30cb5b596');
});

//preparado para un futuro refactor de pagos  y aplicar mejor mvc
app.post("/payment", (req, res) => {
    transfer = req.body;
    console.log("req.body /payment:", req.body);
    PaymentInstance.getPaymentLink(req, res);
});

app.get("/subscription", (req, res) => {
    PaymentInstance.getSubscriptionLink(req, res);
});

app.get("/v1/getDatosFactura", (req, res) => {
    PaymentInstance.getDatosFactura(req, res);
});

app.post("/v1/payInvoice", (req, res) => {
    PaymentInstance.payInvoice(req, res);
});

app.post("/funnelSub", (req, res) => {
    FunnelInstance.postUser(req, res);
});