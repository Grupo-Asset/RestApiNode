import {Router} from 'express'
import {inventoryController} from '../Controllers/inventory'

export const inventoryRouter = Router()

inventoryRouter.get('/products', inventoryController.getAllProducts)
// inventoryRouter.get('/products/:id',inventoryController.getProduct)
inventoryRouter.get('/services', inventoryController.getAllServices)
// inventoryRouter.post('/product/:id', inventoryController.addProduct)
// inventoryRouter.delete('/product/:id', inventoryController.removeProduct)
// inventoryRouter.put('/product/:id', inventoryController.updateQuantity)

