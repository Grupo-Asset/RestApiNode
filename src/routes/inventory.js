import {Router} from 'express'
import {InventoryController} from '../Controllers/inventory.js'

export const inventoryRouter = Router()
const inventoryController = new InventoryController();

inventoryRouter.get('/products', InventoryController.getAllProducts)
inventoryRouter.get('/help', InventoryController.help)
// inventoryRouter.get('/products/:id',inventoryController.getProduct)
inventoryRouter.get('/services', InventoryController.getAllServices)
// inventoryRouter.post('/product/:id', inventoryController.addProduct)
// inventoryRouter.delete('/product/:id', inventoryController.removeProduct)
// inventoryRouter.put('/product/:id', inventoryController.updateQuantity)

