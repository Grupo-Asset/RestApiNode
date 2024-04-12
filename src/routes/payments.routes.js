import {Router} from 'express'
import  {PaymentController}  from '../Controllers/PaymentController.js'
//payment
export const paymentRouter = Router()
//explicacion de pagos, (al menos lo que me acuerdo sumando a lo que estoy por implementar xd)
//dolar es el web scrapper de ambito financiero, help es para test y help xd, Links son de la primera 
//implementacion de mercado pago.
// la idea seria que desde este router se utilizen por medio del paymentController todas las pasarelas de pago y
// todo lo relacionado a facturas (por ahora, quizas son demaciadas responsabilidades pero weno 
// tambien cabe la posibilidad de que separarlo aun mas se me haga aun mas complicado de seguir por que no tenemos
// diagrama)
//todo hacer diagrama 

//aca podria hacer PaymentControllerInstance = new PaymentController pero no hacer aflta por que son metodos async, si eventualmente requiere se peude
paymentRouter.get('/dolar', PaymentController.getDolar)
paymentRouter.get('/help', PaymentController.help)
paymentRouter.get('/paymentLink', PaymentController.getPaymentLink)
paymentRouter.get('/suscriptionLink',PaymentController.getSubscriptionLink)
paymentRouter.get('/datosFactura', PaymentController.getDatosFactura)
paymentRouter.get('/document/:doctype/:id',PaymentController.getDocumentPDF)
paymentRouter.post('/payInvoice',PaymentController.payInvoice)
paymentRouter.patch('/updateInvoice',PaymentController.updateInvoice)

// Mercado Pago intento pro con webhook 
paymentRouter.post('/create-order-meli', PaymentController.mpCreateOrder)
paymentRouter.post('/webhook', PaymentController.mpWebHook)
paymentRouter.get('/success', PaymentController.mpSuccess)
paymentRouter.get('/failure', PaymentController.mpFailure)
paymentRouter.get('/pending', PaymentController.mpPending)

// userRouter.patch('/:id',PaymentController.edit)
//PayPal 
paymentRouter.post('/create-order-paypal', PaymentController.ppCreateOrder)
paymentRouter.get("/capture-order", PaymentController.ppCaptureOrder);
paymentRouter.get("/cancel-order", PaymentController.ppCancelPayment);

