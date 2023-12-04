import {Router} from 'express'
import  PaymentController  from '../Controllers/PaymentController.js'

export const paymentRouter = Router()


//aca podria hacer PaymentControllerInstance = new PaymentController pero no hacer aflta por que son metodos async, si eventualmente requiere se peude
paymentRouter.get('/paymentLink', PaymentController.getPaymentLink)
paymentRouter.get('/suscriptionLink',PaymentController.getSuscriptionLink)
paymentRouter.post('/', PaymentController.getDatosFactura)
paymentRouter.post('/register',PaymentController.payInvoice)
// userRouter.patch('/:id',PaymentController.edit)
