import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mercadopago from 'mercadopago';
import path from 'path';
import axios from 'axios';
import numeral from 'numeral';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const transfer = '';
const app = express();
const PORT = 8080;
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
// app.use(cors({
//     origin: (origin, callback) => {
//         const ACCEPTED_ORIGINS = [
//             'http://localhost:3000',
//             'https://grupo-asset.com',

//         ]
//         if (ACCEPTED_ORIGINS.includes(origin)){
//             return callback(null,true)
//         }if(!origin){
//             return callback(null,true)
//         }
//         return callback(new Error('Not allowed by CORS'))
//     }}));

app.use(cors());
import getFacturaPDFRouter from './routes/getFacturaPDF.js';

import { inventoryRouter } from './routes/inventory.js';
import { userRouter } from './routes/users.js';
import { UserModel } from './models/user.js'; // lo usa apra el init, la verdad que podria estar en el controller que ya lo importa pero no me pagan lo suficiente como para moverlo 
import { PurchaseOrderModel } from './models/purchaseOrder.js';
import { FacturaModel } from './models/factura.js';
import { funnelRouter } from './routes/funnel.js';
import { paymentRouter } from './routes/payments.routes.js';
//routes

app.use('/funnel',      funnelRouter)
app.use('/user',        userRouter )
app.use('/inventory',   inventoryRouter)
app.use('/payment',     paymentRouter)
app.use(getFacturaPDFRouter);

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

