import { Router } from 'express';
import axios from 'axios';
const router = Router();

router.get('/v1/getallProducto', async (req, res) => {
  try {
    // Configurar las opciones para la solicitud
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/products',
      headers: { accept: 'application/json' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      const data = response.data;

      const listaProductos = [];

      for (const producto of data) {
        listaProductos.push(producto);
      }

      res.status(201).send(listaProductos);
    } else {
      console.error(`Error: ${response.status}`);
      res.status(response.status).send({ error: 'Error al obtener datos de productos' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
