import {Router} from 'express'
import {InventoryController} from '../Controllers/inventory.js'
//inventory
export const inventoryRouter = Router()
const inventoryController = new InventoryController();

inventoryRouter.get('/products', InventoryController.getProducts)
inventoryRouter.get('/help', InventoryController.help)
// inventoryRouter.get('/products/:id',inventoryController.getProduct)
inventoryRouter.get('/services', InventoryController.getAllServices)
// inventoryRouter.post('/product/:id', inventoryController.addProduct)
// inventoryRouter.delete('/product/:id', inventoryController.removeProduct)
// inventoryRouter.put('/product/:id', inventoryController.updateQuantity)

