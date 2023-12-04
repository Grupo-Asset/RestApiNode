import {Router} from 'express'
import {FunnelController} from '../Controllers/FunnelController.js'

export const funnelRouter = Router();

funnelRouter.post('/lead', FunnelController.postUser)
funnelRouter.get('/', FunnelController.help)