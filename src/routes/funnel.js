import {Router} from 'express'
import {FunnelController} from '../Controllers/FunnelController.js'

export const funnelRouter = Router();

funnelRouter.post('/', FunnelController.postUser)  
funnelRouter.get('/', FunnelController.help)
funnelRouter.post('/consulta', FunnelController.postConsultaMonday)
