const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mercadopago = require('mercadopago');
const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');
const ventaRouter = require('./routes/PostFactura')
// Configuración del puerto
const PORT = 8080;
require('dotenv').config();

const PaymentController = require("./Controllers/PaymentController");
const PaymentService = require("./Services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());



const path = require('path');
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
app.use(require('./routes/PostFactura'));
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
	
    console.log(req.body);
    console.log('req.body stringify\n\n\n');
    console.log(JSON.stringify(req.body));
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
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
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

app.get('/feedback', function (req, res) {
	console.log('req.query');
	console.log(req.query);
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
app.get("/payment", (req, res) => {
	PaymentInstance.getPaymentLink(req, res);
});

app.get("/subscription", (req, res) => {

	PaymentInstance.getSubscriptionLink(req,res);
});