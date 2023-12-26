import {Router} from 'express'
import  {PaymentController}  from '../Controllers/PaymentController.js'

export const paymentRouter = Router()


//aca podria hacer PaymentControllerInstance = new PaymentController pero no hacer aflta por que son metodos async, si eventualmente requiere se peude
paymentRouter.get('/dolar', PaymentController.getDolar)
paymentRouter.get('/help', PaymentController.help)
paymentRouter.get('/paymentLink', PaymentController.getPaymentLink)
paymentRouter.get('/suscriptionLink',PaymentController.getSubscriptionLink)
paymentRouter.get('/datosFactura', PaymentController.getDatosFactura)
paymentRouter.post('/payInvoice',PaymentController.payInvoice)
paymentRouter.patch('/updateInvoice',PaymentController.updateInvoice)
// userRouter.patch('/:id',PaymentController.edit)
