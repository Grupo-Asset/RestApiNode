import {Router} from 'express'
import  UserController  from '../Controllers/users.js'

export const userRouter = Router()


//aca podria hacer userControllerInstance = new userController pero no hacer aflta por que son metodos async, si eventualmente requiere se peude
userRouter.get('/', UserController.getAll)
userRouter.get('/:id',UserController.getUser)
userRouter.post('/login', UserController.login)
userRouter.post('/register',UserController.register)
userRouter.get('/init', UserController.init)
// userRouter.patch('/:id',UserController.edit)
