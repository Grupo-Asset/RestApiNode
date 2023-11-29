import {Router} from 'express'
import { UserController } from '../Controllers/users.js'

export const userRouter = Router()

userRouter.get('/', UserController.getAll)
userRouter.post('/login', UserController.login)
userRouter.post('/register',UserController.register)
userRouter.patch('/:id',UserController.update)
